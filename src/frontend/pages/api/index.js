// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default function handler(req, res) {
	if (!['GET'].includes(req.method))
		res.status(405).json({ error: 'Only GET is allowed.' });

	if (req.method === 'GET') {
		console.log('GET');
		console.log(req.headers);
		if (req.headers['content-type'] == 'application/json')
			return res
				.status(200)
				.json({ message: 'This is a message from me!' });
		else if (req.headers['content-type'] == 'text/plain' || req.headers.accept.includes('text/plain'))
			return res
        .status(200)
        .send('This is a message from me, but only in plain/text!');
		else return res
      .status(412)
      .send('That type is unavailable');
	}

	res.status(500).json({error: 'Reached the end of the API method with no response.' });
}
