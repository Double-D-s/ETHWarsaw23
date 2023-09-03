#![cfg_attr(not(feature = "std"), no_std, no_main)]

#[ink::contract]
mod blog_post {
    use ink_prelude::string::String;
    use ink_prelude::vec::Vec;
    use ink::storage::Mapping;

    #[ink(storage)]
    pub struct BlogPost {
        feed: Mapping<u32, AccountId>,
        users: Mapping<AccountId, User>,
        posts: Mapping<AccountId, ink_prelude::vec::Vec<Post>>, 
        payment_token: AccountId
    }

    #[derive(scale::Decode, scale::Encode)]
    #[cfg_attr(
    feature = "std",
    derive(scale_info::TypeInfo, ink::storage::traits::StorageLayout))]
    pub struct User {
        bio: String,
    }

    #[derive(scale::Decode, scale::Encode)]
    #[derive(Clone)]
    #[cfg_attr(
    feature = "std",
    derive(scale_info::TypeInfo, ink::storage::traits::StorageLayout))]
    pub struct Post {
        title: String,
        content: String,
        gated: bool,
    }

    impl BlogPost {
        #[ink(constructor)]
        pub fn new(chosen_token: AccountId) -> Self {
            let feed = Mapping::new();
            let users = Mapping::new();
            let posts = Mapping::new();
            let payment_token = chosen_token;
            Self { feed, users, posts, payment_token }
        }

    #[ink(message)]
    pub fn set_user_bio(&mut self, bio: String) {
        let sender = self.env().caller();
        let user = User { bio };
        self.users.insert(sender, &user);
    }

    #[ink(message)]
    pub fn get_user_bio(&self, user: AccountId) -> Option<String> {
        match self.users.get(&user) {
            Some(user_data) => Some(user_data.bio.clone()),
            None => None,
        }
    }

    #[ink(message)]
    pub fn create_post(&mut self, title: String, content: String, gated: bool) {
        let sender = self.env().caller();
        let post = Post {
            title,
            content,
            gated,
        };

    // Retrieve the user's posts from the mapping
    let mut user_posts = self.posts.get(&sender).unwrap_or_else(|| {
        let empty_posts = Vec::new();
        self.posts.insert(sender, (&(&empty_posts)).clone());
        empty_posts
    });

    // Push the new post to the user's posts
    user_posts.push(post);

    // Update the user's posts in the mapping
    self.posts.insert(sender, &user_posts);
}

#[ink(message)]
pub fn get_user_posts(&self, user: AccountId) -> Option<Vec<Post>> {
    self.posts.get(&user).map(|posts| posts.clone())
}

#[ink(message)]
pub fn get_user_post_by_index(&self, user: AccountId, index: u32) -> Option<Post> {
    if let Some(posts) = self.posts.get(&user) {
        if (index as usize) < posts.len() {
            return Some(posts[index as usize].clone());
        }
    }
    None
}

// #[ink(message)]
//         pub fn add_post(&mut self, user: AccountId)  {
//             self.feed.insert(0, &user);
//         }

// #[ink(message)]
// pub fn get_post(&self, proposal_id: u32) -> Option<AccountId> {
//     match self.feed.get(&proposal_id) {
//         Some(proposal) => Some(proposal.clone()),
//         None => None,
//         }
//     }
    }
}
