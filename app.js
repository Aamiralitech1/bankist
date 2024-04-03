const express = require('express');
const dns = require('dns');

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public')); // Serve static files

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html'); // Serve the HTML file
});

const fetchAndFormatWithTTL = (hostname, recordType, callback) => {
    // This is a placeholder. In practice, you would use dns.resolveAny or a similar approach,
    // filter by recordType, and format the results according to the specified format.
    // As an example, we'll call the callback with a simple mocked string.
    const exampleFormattedResult = `Example for ${hostname} of type ${recordType} with TTL`;
    callback(null, exampleFormattedResult);
};


app.get('/check-dns', (req, res) => {
    const { hostname, recordType } = req.query;

    // Function to check if an IP address or nameserver is associated with Cloudflare
    const isCloudflareRelated = (record) => {
        // Simple checks for Cloudflare IP ranges or nameservers
        const cloudflareIndicators = ['cloudflare.com', '173.245.', '103.21.', '103.22.', '103.31.', '141.101.', '108.162.'];
        return cloudflareIndicators.some(indicator => record.includes(indicator));
    };

    // Function to format DNS records for the response and detect Cloudflare usage
    const formatAndDetectCloudflare = (records, detectCloudflare = false) => {
        let usesCloudflare = false;
        const formattedRecords = records.map(record => {
            const recordStr = typeof record === 'object' ? JSON.stringify(record).replace(/[\{\}"]/g, '') : record;
            if (detectCloudflare && isCloudflareRelated(recordStr)) {
                usesCloudflare = true;
            }
            return `<div class="record">${recordStr}</div>`;
        }).join('');

        return { formattedRecords, usesCloudflare };
    };

    // Adjust DNS resolution logic to include special handling for PTR queries
    if (recordType === 'PTR') {
        dns.reverse(hostname, (err, hostnames) => {
            if (err) {
                return res.send(`<h2 class="error">Failed to retrieve PTR records for ${hostname}</h2><p>${err.message}</p><a href="/" class="back-link">Check another</a>`);
            }
            const { formattedRecords, usesCloudflare } = formatAndDetectCloudflare(hostnames);
            let responseHtml = `<h2>PTR Results for ${hostname}</h2><div class="results">${formattedRecords}</div>`;
            if (usesCloudflare) {
                responseHtml += `<p><strong>This site appears to be using Cloudflare.</strong></p>`;
            }
            responseHtml += `<a href="/" class="back-link">Check another</a>`;
            res.send(responseHtml);
        });
    } else {
        // Existing logic for handling A, AAAA, NS, MX, TXT, SRV, DKIM, and DMARC records...
        let resolveFunction;
        switch (recordType) {
            case 'A':
            case 'AAAA':
            case 'SRV':
            case 'PTR': // We keep PTR here for clarity, but it's handled above.
            case 'MX':
            case 'TXT':
                resolveFunction = dns.resolve;
                break;
            case 'NS':
                resolveFunction = dns.resolveNs;
                break;
            case 'DKIM':
            case 'DMARC':
                resolveFunction = dns.resolveTxt;
                break;
            default:
                return res.send(`<h2 class="error">Unsupported record type: ${recordType}</h2><a href="/" class="back-link">Check another</a>`);
        }

        // Execute DNS resolution for the requested type
        if (resolveFunction) {
            resolveFunction(hostname, recordType === 'DKIM' || recordType === 'DMARC' ? 'TXT' : recordType, (err, records) => {
                if (err) {
                    return res.send(`<h2 class="error">Failed to retrieve DNS records for ${hostname}</h2><p>${err.message}</p><a href="/" class="back-link">Check another</a>`);
                }
                // Additional check for A and NS records to detect Cloudflare usage
                if (recordType === 'A' || recordType === 'NS') {
                    const { formattedRecords, usesCloudflare } = formatAndDetectCloudflare(records, true);
                    let responseHtml = `<h2>Results for ${hostname} (${recordType})</h2><div class="results">${formattedRecords}</div>`;
                    if (usesCloudflare) {
                        responseHtml += `<p><strong>This site appears to be using Cloudflare.</strong></p>`;
                    }
                    responseHtml += `<a href="/" class="back-link">Check another</a>`;
                    res.send(responseHtml);
                } else {
                    // For other record types, format without Cloudflare checks
                    const { formattedRecords } = formatAndDetectCloudflare(records);
                    res.send(`<h2>Results for ${hostname} (${recordType})</h2><div class="results">${formattedRecords}</div><a href="/" class="back-link">Check another</a>`);
                }
            });
        }
    }
});

app.listen(port, () => {
    console.log(`DNS Checker app listening at http://localhost:${port}`);
});
