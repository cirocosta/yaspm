# yaspm

```sh
npm install --save yaspm
```

Heavily inspired by [serialport-manager](https://github.com/tmpvar/serialport-manager), does a little part of it being portable to node-webkit.

## Usage

### Machines(sigTerm)
```
/**
 * Describes the conjunction of machines to
 * search for.
 */
```

#### search(onValidDeviceFound)
```
/**
 * Searches for valid devices that are connected
 * @param  {Function} onValidDeviceFound
 * callback function to be resolved with
 * (err|Device) when a valid device is found
 */
```

#### isValidDevice(device)

```
/**
 * Verifies if the device passed to it is valid
 * (given a signature).
 * @param  {obj}  device info about the device
 * @return {Boolean}        true|false
 */
```

### Device()
```
/**
 * Represents a valid Device.
 * @param {obj} device the info about the device
 * @param {obj} sp     serialport object
 */
```

#### connect(ocb, ccb)
```
/**
 * Tries to connect to the device.
 * @param  {Function} ocb callback function for
 *                        the open event
 * @param  {Function} ccb callback function for
 *                        the close event
 */
```

#### registerToData(cb)
```
/**
 * Sets a listener for the 'data' event of the
 * device.
 * @param  {Function} cb callback function to be
 *                       called with (err|data)
 *                       whenever data|err
 *                       comes.
 */
```

#### write(what, cb)
```
/**
 * Writes to the device (which must be
 * connected).
 * @param  {string}   what what to be written to
 *                         it
 * @param  {Function} cb   callback to the write
 *                         operation
 */
```
