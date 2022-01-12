CREATE TABLE passenger(passId INT64, passName STRING(1024), passMail STRING(1024), passDob DATE)PRIMARY KEY (passId, passDob);

CREATE TABLE flight(flightId INT64,flightSource STRING(1024),flightDest STRING(1024),flightDate DATE,flightSeat INT64,ticketCost FLOAT64)PRIMARY KEY (flightId,flightDate);

CREATE TABLE booking(ShardId INT64,bookingId INT64,flightId INT64,bookDate DATE,FOREIGN KEY (flightId) REFERENCES flight(flightId))PRIMARY KEY (ShardId,bookingId);
CREATE INDEX bookingIdx ON booking(bookingId);

CREATE TABLE bookingdetails(bookingId INT64,passId INT64,FOREIGN KEY (passId) REFERENCES passenger(passId),FOREIGN KEY (bookingId) REFERENCES booking(bookingId))PRIMARY KEY (bookingId,passId);

CREATE TABLE sequences (
  name STRING(64) NOT NULL,
  next_value INT64 NOT NULL,
) PRIMARY KEY(name);
