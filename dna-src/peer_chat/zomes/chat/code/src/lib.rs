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

#[derive(Serialize, Deserialize, Debug, DefaultJson,Clone)]
#[serde(rename_all = "camelCase")]
pub struct Message {
    id: String,
    created_at: u32,
    text: String
}

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
            name: "message",
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
                    link_type: "message_link_to",
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

    #[entry_def]
    fn root_anchor_def() -> ValidatingEntryType {
        holochain_anchors::root_anchor_definition()
    }

    #[zome_fn("hc_public")]
    fn post_message(message: Message) -> ZomeApiResult<Address> {
        hdk::debug(format!("Message Posted: {:?}", &message)).ok();
        let entry = Entry::App("message".into(), message.into());
        let address = hdk::commit_entry(&entry)?;
        let anchor_address = holochain_anchors::create_anchor("messages".into(), "mine".into())?;
        hdk::link_entries(&anchor_address, &address, "message_link_to", "")?;
        Ok(address)
    }

    #[zome_fn("hc_public")]
    fn get_message(address: Address) -> ZomeApiResult<Option<Entry>> {
        hdk::get_entry(&address)
    }

    #[zome_fn("hc_public")]
    fn get_messages() -> ZomeApiResult<Vec<Message>> {
        let anchor_address = holochain_anchors::create_anchor("messages".into(), "mine".into())?;
        hdk::utils::get_links_and_load_type(&anchor_address, LinkMatch::Exactly("message_link_to"), LinkMatch::Any)
    }
}
