# yaspm

```sh
npm install --save yaspm
```

Heavily inspired by [serialport-manager](https://github.com/tmpvar/serialport-manager) and [node-grbl](https://github.com/tmpvar/node-grbl), does a little part of it being portable to node-webkit.

## Example Usage

```javascript
Machines
  .search()
  .on('validdevice', function (device) {
    device
      .connect()
      .on('connect', handleConnect.bind(null, device))
      .on('disconnect', handleDisconnect.bind(null, device));
  })
  .on('removeddevice', function (pnpId) {
    console.log('Just removed: ' + pnpId);
  });
```

pretty simple :smiley_cat:
