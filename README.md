# Scrapoo

## Installation

1. Clone repository and run installation
```
git clone https://github.com/popovsergiy/scrapoo
npm install
```
2. Customization nginx configuration
See config bellow.
3. Create data folder
```
mkdir -p data/scraped/cheapbasket
// and so on
```

## Workflow
### Development
For development run command
```
au run --watch
```
For deployment
```
au build --env prod
```
Then copy the file index.html and the folder /scripts to the main deployment folder on your server [link](https://github.com/aurelia/framework/blob/master/doc/article/en-US/the-aurelia-cli.md).

## Usage Console
### Linux
```
npm run start-cli-linux
```
### Windows
```
node main.js
```

## Usage HTTP Server
### Linux
> Before run script on Linux machine you must install xvfb
Run HTTP server with next command
```
npm run start-linux
```
### Windows
```
npm start
```
or
```
node index.js
```

> 1.
> Problem: npm ERR! Cannot read property '0' of undefined
> Solution: delete node_modules folder and package-lock.json file.



## Nginx API configuration
```
server {
    listen 80;
    server_name api.scrapoo.agere.com.ua;

    root /web/sites/scrapoo/data/production;
    index index.html;

    location /data/ {
        try_files $uri $uri/ =404;
    }

    location /api/ {
        # Simple requests
        if ($request_method ~* "(GET|POST)") {
          add_header "Access-Control-Allow-Origin"  *;
        }

        # Preflighted requests
        if ($request_method = OPTIONS ) {
          add_header "Access-Control-Allow-Origin"  *;
          add_header "Access-Control-Allow-Methods" "GET, POST, OPTIONS, HEAD";
          add_header "Access-Control-Allow-Headers" "Authorization, Origin, X-Requested-With, Content-Type, Accept";
          return 200;
        }

        proxy_pass http://localhost:1337/api/;

        proxy_http_version 1.1;
        proxy_set_header Host               $host;
        proxy_set_header X-Real-IP          $remote_addr;
        proxy_set_header X-Forwarded-For    $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto  $scheme;
    }
}
```
