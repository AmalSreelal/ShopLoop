const paypal = require("paypal-rest-sdk");

paypal.configure({
    mode: 'sandbox',
    client_id: 'AZJhnxpBV6xipSCPteXxMqFoeGaRIvGtjnQoKTnZbV21emGP2LPAoAsgm6OScHtXDeclzDG9Kg-5m1YV', // your client_id
    client_secret : 'EEGFbLpp6twizeWnAZhzOftMTNhRDeb0qZlkF6zUnJQeUdcX4ybD7zcTypzABztFDv1m6azx1YwBDkWP', // your client_secret
})

module.exports = paypal;