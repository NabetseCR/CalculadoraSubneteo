const calculator = document.querySelector('.content');
const keys = calculator.querySelector('.calculator-keys');
const display = document.querySelector('.entry');
const excuter = document.getElementById('submit');

let auxText = "";
let auxIp = "10.1.36.0/28";

keys.addEventListener('click', e => {
    if (e.target.matches('button')) {
        const key = e.target;
        const action = key.dataset.action;
        const keyContent = key.textContent;
        if (!action) {
                auxText += keyContent;
                display.textContent = auxText;
        }
        if (action === 'clr'){
            auxText = "";
            display.textContent = "Enter an IP ("+"10.1.36.0/28"+")";
        }
        if (action === 'del'){
            auxText = auxText.substring(0, auxText.length - 1);
            display.textContent = auxText;
        }
    }
});

excuter.addEventListener('click', e => {
    auxIp = auxText
    auxText = getIpRangeFromAddressAndNetmask(auxIp);
    display.textContent = auxText;
});

function getIpRangeFromAddressAndNetmask(str) {
  var part = str.split("/"); // part[0] = base address, part[1] = netmask
  var ipaddress = part[0].split('.');
  var netmaskblocks = ["0","0","0","0"];
  if(!/\d+\.\d+\.\d+\.\d+/.test(part[1])) {
    // part[1] has to be between 0 and 32
    netmaskblocks = ("1".repeat(parseInt(part[1], 10)) + "0".repeat(32-parseInt(part[1], 10))).match(/.{1,8}/g);
    netmaskblocks = netmaskblocks.map(function(el) { return parseInt(el, 2); });
  } else {
    // xxx.xxx.xxx.xxx
    netmaskblocks = part[1].split('.').map(function(el) { return parseInt(el, 10) });
  }
  // invert for creating broadcast address (highest address)
  var invertedNetmaskblocks = netmaskblocks.map(function(el) { return el ^ 255; });
  var baseAddress = ipaddress.map(function(block, idx) { return block & netmaskblocks[idx]; });
  var broadcastaddress = baseAddress.map(function(block, idx) { return block | invertedNetmaskblocks[idx]; });
  return [baseAddress.join('.'), broadcastaddress.join('.')];
}
