# firebase_messaging

A Deno module for sending push notifications through Firebase Cloud Messaging (FCM). This module simplifies the process of sending messages and managing Firebase Cloud Messaging services.

## Features

- Send push notifications to Android, iOS, and web clients.
- Automatically handles JWT creation and OAuth2 token retrieval.
- Built-in error handling for common issues.
- Supports Deno runtime.

## Prerequisites

Before using this module, you will need:

- A Firebase project and its corresponding credentials.
- Service account key file from your Firebase project.

## Installation

This module is available on the Deno registry and can be imported directly into your project.

```ts
import { FcmClient } from 'https://deno.land/x/firebase_messaging/mod.ts';
```

## Usage
To send push notifications, follow these steps:

## Set up the FCM client
First, initialize FcmClient with your Firebase service account credentials and project ID. If you are downloading a JSON key file from your Firebase account, you can put this in an environment variable as shown below.

```ts

const serviceAccount = JSON.parse(Deno.env.get('FIREBASE_CREDENTIALS'))

const fcmClient = new FcmClient(serviceAccount);
```


## Send a Notification
Use the sendFcmNotification method to send a notification.
```ts

const targetToken = 'receiver-device-token';
const message = {
  notification: {
    title: "Hello World!",
    body: "This is a notification sent from Deno!",
  },
  token: targetToken,
};

try {
  const response = await fcmClient.sendNotification(targetToken, message);
  console.log("Sent:", response);
} catch (error) {
  console.error("Error:", error);
}


```

## API Reference
The primary class provided by this module is FcmClient, which includes the following methods:

* constructor(serviceAccountCredentials): Initializes a new instance of the FCM client.
* sendNotification(fcmToken, message): Sends a push notification to a single FCM token.

## License
This project is licensed under the MIT License

## Contributing
Contributions to firebase_messaging are welcome. Please ensure that your pull requests are well-described and pass all the tests.

## Disclaimer
This module is not officially affiliated with Google or Firebase. It is a third-party implementation designed to work with Firebase Cloud Messaging.