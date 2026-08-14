(function () {
  'use strict';

  function init() {
    const output = document.getElementById('uuid-output');

    document.getElementById('btn-single').addEventListener('click', () => {
      output.value = DevBoxSDK.uuidv4();
    });

    document.getElementById('btn-bulk').addEventListener('click', () => {
      const uuids = [];
      for (let i = 0; i < 10; i++) uuids.push(DevBoxSDK.uuidv4());
      output.value = uuids.join('\n');
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
