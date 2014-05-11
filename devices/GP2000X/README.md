# GP2000X

## Message format
NMEA 0183 format:
`"$GPRMC,162017.000,A,5551.5039,N,03740.0065,E,0.00,,040912,0,,A*75+79123456789#"`

## Setup

Set your phone as admin phone
`*ADMIN+79121234567#0000#`

GPRS setup. 021.012.123.021 is server ip, 9102 - tcp port, 0000 - password
`*HOSIP021.012.123.021#9102#0000#`

Set APN name
`*AT+CSTT=internet#`

Set GPRS mode
`*WMODE1011#0000#`

Setup tracker to send gps info every 30 seconds
`*AUTOT02#30S#0000#`
