pragma solidity 0.5.0;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";

contract GerenukToken is ERC20 {
  // add your token code here
  string public name = "GerenukToken";
  string public symbol = "GNK";
  uint256 public INITIAL_SUPPLY = 1200000;

  constructor() public {
    _mint(msg.sender, INITIAL_SUPPLY);
  }
}