#![feature(proc_macro_hygiene)]
#[macro_use]
extern crate hdk;
extern crate hdk_proc_macros;
extern crate serde;
#[macro_use]
extern crate serde_derive;
extern crate serde_json;
#[macro_use]
extern crate holochain_json_derive;

use hdk::{
    entry_definition::ValidatingEntryType,
    error::ZomeApiResult,
};
use hdk::holochain_core_types::{
    entry::Entry,
    dna::entry_types::Sharing,
};
use hdk::holochain_json_api::{
    json::JsonString,
    error::JsonError
};
use hdk::holochain_persistence_api::{
    cas::content::Address
};
use hdk_proc_macros::zome;
use hdk::prelude::LinkMatch;
use holochain_anchors::anchor;

#[derive(Serialize, Deserialize, Debug, DefaultJson,Clone)]
#[serde(rename_all = "camelCase")]
pub struct Message {
    id: String,
    created_at: u32,
    text: String
}

const MESSAGE_LINK_TYPE: &str = "message_link_to";
const MESSAGE_ENTRY_NAME: &str = "message";
const MESSAGE_ANCHOR_TYPE: &str = "messages";
const MESSAGE_ANCHOR_TEXT: &str = "mine";

#[zome]
mod chat {

    #[init]
    fn init() {
        Ok(())
    }

    #[validate_agent]
    pub fn validate_agent(validation_data: EntryValidationData<AgentId>) {
        Ok(())
    }

    #[entry_def]
     fn message_entry_def() -> ValidatingEntryType {
        entry!(
            name: MESSAGE_ENTRY_NAME,
            description: "The message in a chat list",
            sharing: Sharing::Public,
            validation_package: || {
                hdk::ValidationPackageDefinition::Entry
            },
            validation: | _validation_data: hdk::EntryValidationData<Message>| {
                Ok(())
            },
            links: [
                from!(
                    holochain_anchors::ANCHOR_TYPE,
                    link_type: MESSAGE_LINK_TYPE,
                    validation_package: || {
                        hdk::ValidationPackageDefinition::Entry
                    },

                    validation: |_validation_data: hdk::LinkValidationData| {
                        Ok(())
                    }
                )
            ]
        )
    }

    #[entry_def]
    fn anchor_def() -> ValidatingEntryType {
        holochain_anchors::anchor_definition()
    }

    #[zome_fn("hc_public")]
    fn post_message(message: Message) -> ZomeApiResult<Address> {
        hdk::debug(format!("Message Posted: {:?}", &message)).ok();
        let entry = Entry::App(MESSAGE_ENTRY_NAME.into(), message.into());
        let address = hdk::commit_entry(&entry)?;
        hdk::link_entries(&anchor(MESSAGE_ANCHOR_TYPE.to_string(), MESSAGE_ANCHOR_TEXT.to_string())?, &address, MESSAGE_LINK_TYPE, "")?;
        Ok(address)
    }

    #[zome_fn("hc_public")]
    fn get_message(address: Address) -> ZomeApiResult<Option<Entry>> {
        hdk::get_entry(&address)
    }

    #[zome_fn("hc_public")]
    fn get_messages() -> ZomeApiResult<Vec<Message>> {
        hdk::utils::get_links_and_load_type(&anchor(MESSAGE_ANCHOR_TYPE.to_string(), MESSAGE_ANCHOR_TEXT.to_string())?, LinkMatch::Exactly(MESSAGE_LINK_TYPE), LinkMatch::Any)
    }
}
