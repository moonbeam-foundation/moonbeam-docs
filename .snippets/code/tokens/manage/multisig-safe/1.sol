pragma solidity ^0.8.30;

contract SetText {
    string public text;
    
    function setTextData(string calldata _text) public {
        text = _text;
    }
}
