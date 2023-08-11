import axios from 'axios';
const https = require('https');

export default async function handler(req, res) {
    if(!["POST"].includes(req.method)) return res.status(405).json({error: "Method not allowed."})
    const { phoneNumber, firstName, lastName, email } = req.query;
    
    if(req.method === "POST"){
        try {
            const response = await axios.post(
                'https://localhost:7166/api/Customers', 
                {
                  'phoneNumber': phoneNumber,
                  'firstName': firstName,
                  'lastName': lastName,
                  'email': email
                },
                {
                  headers: {
                    'accept': 'text/plain',
                    'Content-Type': 'application/json'
                  },
                  httpsAgent: new https.Agent({ 
                      rejectUnauthorized: false 
                  })
                }
            );

            // You might want to handle or return something based on the response
            return res.status(200).json(response.data); // For example

        } catch (error) {
            // Handle the error, maybe return the error message to the client
            return res.status(500).json({ error: error.message });
        }
    }
    
    return res.status(500).json({ error: "Reached the end of the API with no resolution."})
}