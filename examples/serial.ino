/**
 * Example of arduino program to be flashed into
 * the arduino to run along with
 * example-serial.js.
 */

int led = 13;
int times;

void setup () {
  pinMode(led, OUTPUT);

  Serial.begin(9600);
  Serial.println("How many times to blink?");
}

void blink (int ledPin, int times) {
  for (int i = 0; i < times; i++) {
    digitalWrite(led, HIGH);
    delay(300);
    digitalWrite(led, LOW);
    delay(300);
  }
}

void loop () {
  if (Serial.available() <= 0) {
    return;
  }

  times = Serial.parseInt();
  Serial.flush();
  blink(led, times);
  Serial.println("How many times to blink?");
}
