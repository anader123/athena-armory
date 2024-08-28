pragma solidity ^0.8.19;

import "forge-std/Test.sol";
import "forge-std/console.sol";
import {AgentTokenCreator} from "../src/AgentTokenCreator.sol";

interface IZoraContract {
    function nextTokenId() external view returns (uint256);
    function multicall(bytes[] calldata data) external;
    function addPermission(uint256 tokenId, address user, uint256 permissionBits) external;
    function isAdminOrRole(address user, uint256 tokenId, uint256 role) external view returns (bool);
}

contract AgentTokenCreatorTest is Test {
    AgentTokenCreator agentTokenCreator;
    IZoraContract zoraContract;
    address fixedPriceMinter = address(0xd34872BE0cdb6b09d45FCa067B07f04a1A9aE1aE);
    address createRef = address(0x456);
    address agent1 = address(0x2b54EB55b797554dA7e3026EB9B7f4506040B5c3);
    address agent2 = address(0xABC);
    address agent3 = address(0x123);

    function setUp() public {
        zoraContract = IZoraContract(0xa3655Ff67a16D1f5449E379c9Cf4A80479bb8643);

        address[] memory agents = new address[](3);
        agents[0] = agent1;
        agents[1] = agent2;
        agents[2] = agent3;
        uint8 numVotesRequired = 2;

        agentTokenCreator =
            new AgentTokenCreator(agents, numVotesRequired, address(zoraContract), fixedPriceMinter, createRef);

        vm.prank(agent1);
        zoraContract.addPermission(0, address(agentTokenCreator), 2);
    }

    function testCreateTokenSuccessful() public {
        uint256 tokenId = zoraContract.nextTokenId();
        string memory ipfsHash = "QmHashExample";
        string memory reason = "Good reason";

        vm.prank(agent1);
        agentTokenCreator.submitTokenVote(tokenId, ipfsHash, reason);

        vm.prank(agent2);
        agentTokenCreator.submitTokenVote(tokenId, ipfsHash, reason);

        vm.prank(agent3);
        agentTokenCreator.submitTokenVote(tokenId, ipfsHash, reason);

        // // Move time forward to satisfy the timeBetweenTokens requirement
        // vm.warp(block.timestamp + 1 days);

        vm.prank(agent1);
        agentTokenCreator.createToken(tokenId, ipfsHash);
    }
}
