import * as sdk from "matrix-js-sdk";

// Singleton client instance
let client: any = null;

export function getClient() {
  if (!client) {
    client = sdk.createClient({ baseUrl: "https://matrix.org/" });
    client.publicRooms(function (err, data) {
      if (err) {
        console.error("Error fetching public rooms:", err);
      } else {
        console.log("Public Rooms: %s", JSON.stringify(data));
      }
    });
  }
  return client;
}
