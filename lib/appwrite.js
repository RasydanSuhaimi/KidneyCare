import {
    Account,
    Avatars,
    Client,
    Databases,
    ID,
    Query,
  } from "react-native-appwrite";


export const config = {
    endpoint: 'https://cloud.appwrite.io/v1',
    platform: 'com.fyp.kidneycare',
    projectId: '66caef340030511c5609',
    databaseId: '66caf11a0038696b3941',
    usersCollectionId: '66caf14c0025ec79a2ce'
};

const client = new Client();

client
    .setEndpoint(config.endpoint) 
    .setProject(config.projectId)
    .setPlatform(config.platform) 

    const account = new Account(client);
    const avatars = new Avatars(client);
    const databases = new Databases(client);


export const createUser = async (email, password, username ) => {
    try{
        const newAccount = await account.create(
            ID.unique(),
            email,
            password,
            username
        )

        if(!newAccount) throw Error;

        const avatarUrl = avatars.getInitials(username)

        await signIn(email, password)

        const newUser = await databases.createDocument(

            config.databaseId,
            config.usersCollectionId,
            ID.unique(),
            {
                accountId: newAccount.$id,
                email,
                username,
                avatar: avatarUrl
            }
        )

        return newUser;

    } catch (error){
        console.log(error);
        throw new Error(error);
    }
}

export const signIn = async (email, password) => {
  try {

    const session = await account.createEmailPasswordSession(email, password)

    return session;
  } catch (error) {
    throw new Error(error);
  }
}


export const getCurrentUser = async () => {
    try {
        const currentAccount = await account.get();

        if(!currentAccount) throw Error;

        const currentUser = await databases.listDocuments(
            config.databaseId,
            config.usersCollectionId,
            [Query.equal('accountId', currentAccount.$id)] 
        )

        if(!currentUser) throw Error

        return currentUser.documents[0];
    } catch (error) {
       console.log(error); 
    }
}