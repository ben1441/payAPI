# payAPI
API for sending transactions on bttc chain

##install
```git clone https://github.com/ben1441/payAPI.git```
```cd payAPI```
```npm install```
```npm run start```

##usage
*method:*
post ```/btt/sendTransaction```
runs on local host 5000
```http://localhost:5000/```
body:
```{
  privateKey: YOUR-PRIVATE-KEY, 
  to: RECEIVER-ADDRESS, 
  amount: AMOUNT
}```
