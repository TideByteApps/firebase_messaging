import {
    SignJWT,
    importPKCS8,
  } from 'https://deno.land/x/jose@v5.1.0/index.ts';
  
  interface ServiceAccountCredentials {
    client_email: string;
    private_key: string;
  }
  
  class FcmClient {
    private serviceAccountCredentials: ServiceAccountCredentials;
    private projectId: string;
  
    constructor(serviceAccountCredentials: ServiceAccountCredentials) {
      this.serviceAccountCredentials = serviceAccountCredentials;
      this.projectId = serviceAccountCredentials.project_id;
    }
  
    private async createJwt() {
      const privateKey = this.serviceAccountCredentials.private_key;
      const clientEmail = this.serviceAccountCredentials.client_email;
  
      try {
        const ecPrivateKey = await importPKCS8(privateKey, 'RS256');
  
        const payload = {
          iss: clientEmail,
          sub: clientEmail,
          aud: "https://oauth2.googleapis.com/token",
          iat: Math.floor(Date.now() / 1000),
          exp: Math.floor(Date.now() / 1000) + 3600,
          scope: "https://www.googleapis.com/auth/firebase.messaging",
        };
  
        const jwt = await new SignJWT(payload)
          .setProtectedHeader({ alg: 'RS256' })
          .sign(ecPrivateKey);
  
        return jwt;
      } catch (error) {
        console.error('Error creating JWT:', error);
        throw error;
      }
    }
  
    private async obtainAccessToken(jwt: string) {
      const response = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
          assertion: jwt,
        }),
      });
  
      if (!response.ok) {
        throw new Error(`Error obtaining access token: ${await response.text()}`);
      }
  
      const { access_token } = await response.json();
      return access_token;
    }
  
    public async sendNotification(fcmToken: string, message: object) {
      try {
        const jwt = await this.createJwt();
        const accessToken = await this.obtainAccessToken(jwt);
  
        const response = await fetch(`https://fcm.googleapis.com/v1/projects/${this.projectId}/messages:send`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: {
              token: fcmToken,
              ...message,
            },
          }),
        });
  
        if (!response.ok) {
          throw new Error(`Error sending push notification: ${await response.text()}`);
        }
  
        console.log('Notification sent successfully');
        return await response.json();
      } catch (error) {
        console.error('Error sending push notification:', error);
        throw error;
      }
    }
  }
  
  export { FcmClient, ServiceAccountCredentials };
  


