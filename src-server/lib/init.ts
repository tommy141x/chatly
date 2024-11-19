import { Databases, Permission, Role, Storage } from "node-appwrite";

export const init = async (client) => {
  const databases = new Databases(client);
  const storage = new Storage(client);
  const DATABASE_ID = "chatly_live";

  // Create or verify database exists
  try {
    await databases.create(DATABASE_ID, "Chatly Live", true);
  } catch (error) {
    if (error.code !== 409) throw error;
  }

  // Initialize Users Collection
  try {
    await databases.createCollection(
      DATABASE_ID,
      "users",
      "Users",
      [Permission.read(Role.any()), Permission.create(Role.users())],
      true,
    );

    const userAttributes = [
      { name: "nickname", size: 32, required: true },
      { name: "bio", size: 256, required: false },
      { name: "status_type", size: 32, required: false, default: "offline" },
      { name: "status_message", size: 128, required: false },
      { name: "status_timestamp", type: "datetime", required: false },
      { name: "connections", size: 1024, required: false },
      { name: "settings", size: 2048, required: false },
      { name: "posts", size: 2048, required: false },
    ];

    for (const attr of userAttributes) {
      const {
        name,
        size,
        required,
        type = "string",
        default: defaultValue,
      } = attr;
      if (type === "string") {
        await databases.createStringAttribute(
          DATABASE_ID,
          "users",
          name,
          size,
          required,
          defaultValue,
        );
      } else if (type === "datetime") {
        await databases.createDatetimeAttribute(
          DATABASE_ID,
          "users",
          name,
          required,
        );
      }
    }
  } catch (error) {
    if (error.code !== 409) throw error;
  }

  // Initialize Servers Collection
  try {
    await databases.createCollection(
      DATABASE_ID,
      "servers",
      "Servers",
      [Permission.read(Role.any()), Permission.create(Role.users())],
      true,
    );

    const serverAttributes = [
      { name: "name", size: 64, required: true },
      { name: "description", size: 512, required: false },
      { name: "settings", size: 2048, required: false },
    ];

    for (const {
      name,
      size,
      array = false,
      type = "string",
      required,
    } of serverAttributes) {
      await databases.createStringAttribute(
        DATABASE_ID,
        "servers",
        name,
        size,
        required,
        null,
        array,
      );
    }

    await databases.createRelationshipAttribute(
      DATABASE_ID,
      "servers",
      "users",
      "oneToOne",
      true,
      "owner",
      null,
      "restrict",
    );

    await databases.createRelationshipAttribute(
      DATABASE_ID,
      "users",
      "servers",
      "manyToMany",
      true,
      "servers",
      "members",
      "cascade",
    );
  } catch (error) {
    if (error.code !== 409) throw error;
  }

  // Initialize Groups Collection
  try {
    await databases.createCollection(
      DATABASE_ID,
      "groups",
      "Groups",
      [Permission.read(Role.any()), Permission.create(Role.users())],
      true,
    );

    const groupAttributes = [
      { name: "name", size: 64, required: true },
      { name: "description", size: 512, required: false },
    ];

    for (const { name, size, required } of groupAttributes) {
      await databases.createStringAttribute(
        DATABASE_ID,
        "groups",
        name,
        size,
        required,
      );
    }

    await databases.createRelationshipAttribute(
      DATABASE_ID,
      "groups",
      "users",
      "oneToOne",
      true,
      "owner",
      null,
      "restrict",
    );

    await databases.createRelationshipAttribute(
      DATABASE_ID,
      "groups",
      "users",
      "manyToMany",
      true,
      "members",
      "groups",
      "cascade",
    );

    await databases.createRelationshipAttribute(
      DATABASE_ID,
      "groups",
      "group-messages",
      "oneToMany",
      true,
      "messages",
      "location",
      "cascade",
    );
  } catch (error) {
    if (error.code !== 409) throw error;
  }

  // Initialize Channels Collection
  try {
    await databases.createCollection(
      DATABASE_ID,
      "channels",
      "Channels",
      [Permission.read(Role.any()), Permission.create(Role.users())],
      true,
    );

    const channelAttributes = [
      { name: "name", size: 64, required: true },
      { name: "type", size: 32, required: true },
      { name: "settings", size: 2048, required: false },
      { name: "category", size: 64, required: false },
    ];

    for (const { name, size, required } of channelAttributes) {
      await databases.createStringAttribute(
        DATABASE_ID,
        "channels",
        name,
        size,
        required,
      );
    }

    await databases.createRelationshipAttribute(
      DATABASE_ID,
      "channels",
      "servers",
      "manyToOne",
      true,
      "server",
      "channels",
      "restrict",
    );
  } catch (error) {
    if (error.code !== 409) throw error;
  }

  // Initialize Message Collections
  const messageCollections = [
    "direct-messages",
    "channel-messages",
    "group-messages",
  ];

  for (const collection of messageCollections) {
    try {
      await databases.createCollection(
        DATABASE_ID,
        collection,
        collection
          .replace("-", " ")
          .replace(/\b\w/g, (char) => char.toUpperCase()),
        [Permission.read(Role.any()), Permission.create(Role.users())],
        true,
      );

      const messageAttributes = [
        { name: "content", size: 4096, required: true },
        { name: "attachments", size: 2048, required: false },
        { name: "timestamp", type: "datetime", required: true },
        { name: "reactions", size: 512, type: "array", required: false },
      ];

      for (const {
        name,
        size,
        required,
        type = "string",
      } of messageAttributes) {
        if (type === "string") {
          await databases.createStringAttribute(
            DATABASE_ID,
            collection,
            name,
            size,
            required,
          );
        } else if (type === "datetime") {
          await databases.createDatetimeAttribute(
            DATABASE_ID,
            collection,
            name,
            required,
          );
        } else if (type === "array") {
          await databases.createStringAttribute(
            DATABASE_ID,
            collection,
            name,
            size,
            required,
            null,
            true,
          );
        }
      }

      await databases.createRelationshipAttribute(
        DATABASE_ID,
        collection,
        "users",
        "manyToOne",
        true,
        "sender",
        null,
        "restrict",
      );

      if (collection === "direct-messages") {
        await databases.createRelationshipAttribute(
          DATABASE_ID,
          collection,
          "users",
          "manyToOne",
          true,
          "recipient",
          "incoming-messages",
          "restrict",
        );
      } else if (collection === "group-messages") {
        await databases.createRelationshipAttribute(
          DATABASE_ID,
          collection,
          "groups",
          "manyToOne",
          true,
          "location",
          "messages",
          "restrict",
        );
      } else {
        await databases.createRelationshipAttribute(
          DATABASE_ID,
          collection,
          "channels",
          "manyToOne",
          true,
          "location",
          "messages",
          "restrict",
        );
      }
    } catch (error) {
      if (error.code !== 409) throw error;
    }
  }

  // Create Storage Buckets
  try {
    const bucketConfigs = [
      { id: "avatars", name: "Avatars" },
      { id: "banners", name: "Banners" },
      { id: "attachments", name: "Attachments" },
    ];

    for (const { id, name } of bucketConfigs) {
      try {
        await storage.createBucket(
          id,
          name,
          [Permission.read(Role.any())],
          false,
          true,
          30_000_000,
          [],
          "none",
          true,
          true,
        );
      } catch (error) {
        if (error.code !== 409) throw error;
      }
    }
  } catch (error) {
    if (error.code !== 409) throw error;
  }
};
