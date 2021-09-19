var GerenukToken = artifacts.require("./GerenukToken.sol");

module.exports = function (deployer) {
  deployer.deploy(GerenukToken);
};
