# Patchwork Kingdoms - Statistic-Service

A service to run calculations for statistics on each nft individually and to run overall statistic evaluations.

**Requirements**
- Node.js >= v16.16.0

**Setup** 
```
npm install 
```

Prepare a *.env* file:
```
OPENSEA_API_KEY=

DATABASE_URL=*?sslmode=require&connection_limit=10&pool_timeout=0
```
where '*' is the db path and the following parameters need to be included in your setup

**Run project locally** 
```
node index.js
```