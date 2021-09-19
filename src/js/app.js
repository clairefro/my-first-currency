App = {
  web3Provider: null,
  contracts: {},
  web3js: null,

  init: function () {
    return App.initWeb3();
  },

  initWeb3: async function () {
    if (typeof window.ethereum !== "undefined") {
      // metamask added ethereum to window
      App.web3Provider = window["ethereum"];
    }
    // window.web3 is deprecated with metamask: https://docs.metamask.io/guide/provider-migration.html#replacing-window-web3
    // App.web3js = new Web3(App.web3Provider);
    const chainId = await ethereum.request({ method: "eth_chainId" });
    console.log({ chainId });
    return App.initContract();
  },

  initContract: function () {
    $.getJSON("GerenukToken.json", function (data) {
      var GerenukTokenArtifact = data;
      App.contracts.GerenukToken = TruffleContract(GerenukTokenArtifact);
      App.contracts.GerenukToken.setProvider(window.ethereum);
      return App.getBalances();
    });

    return App.bindEvents();
  },

  bindEvents: function () {
    $(document).on("click", "#transferButton", App.handleTransfer);
  },

  handleTransfer: function (event) {
    event.preventDefault();

    var amount = parseInt($("#TTTransferAmount").val());
    var toAddress = $("#TTTransferAddress").val();

    console.log("Transfer " + amount + " GNK to " + toAddress);

    var gerenukTokenInstance;
    window.ethereum
      .request({ method: "eth_accounts" })
      .then(function (accounts) {
        var account = accounts[0];

        App.contracts.GerenukToken.deployed()
          .then(function (instance) {
            gerenukTokenInstance = instance;

            return gerenukTokenInstance.transfer(toAddress, amount, {
              from: account,
              gas: 100000,
            });
          })
          .then(function (result) {
            alert("Transfer Successful!");
            return App.getBalances();
          })
          .catch(function (err) {
            console.log(err.message);
          });
      });
  },

  getBalances: function () {
    console.log("Getting balances...");
    var gerenukTokenInstance;
    window.ethereum
      .request({ method: "eth_accounts" })
      .then(function (accounts) {
        var account = accounts[0];
        // WARNING: For dev purposes only. Do not include in prod as it exposes private key
        console.log("Displaying info for account ", account);
        App.contracts.GerenukToken.deployed()
          .then(function (instance) {
            gerenukTokenInstance = instance;
            return gerenukTokenInstance.balanceOf(account);
          })
          .then(function (result) {
            balance = result.c[0];
            $("#TTBalance").text(balance);
          })
          .catch(function (err) {
            console.log(err.message);
          });
      })
      .catch(function (err) {
        console.log(err);
      });
  },
};

$(function () {
  $(window).load(function () {
    App.init();
  });
});
