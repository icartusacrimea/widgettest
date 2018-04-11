Events-listing widget that calls (dev, for now) Catalog API.

Temporarily works out 'domain url' from IP address to run locally. This will eventually be replaced with actual domain.
Simulates third-party server by serving 'client' directory.

Directions for Testing:

1. clone repo
2. cd widgettest
3. npm init
4. npm install
5. node index.js
6. go to http://0.0.0.0:45715, replacing 0.0.0.0 with your ip address. find your ip address by running 'ipconfig'
6. type events search team in search bar on simulated client site and press enter or click 'search'
