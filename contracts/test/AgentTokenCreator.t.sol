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
    IZoraContract zoraContract = IZoraContract(0xcDC7d6e98265097513A1D3c3993fce0eEca4ECd5);
    address fixedPriceMinter = address(0xd34872BE0cdb6b09d45FCa067B07f04a1A9aE1aE);
    address createRef = address(0x456);
    uint256 startTime = block.timestamp;

    struct VoteOption {
        string name;
        string ipfsHash;
    }

    address[] public agents = [address(0x2b54EB55b797554dA7e3026EB9B7f4506040B5c3), address(0xABC), address(0x123)];

    event VoteSubmitted(address indexed agent, uint256 indexed tokenId, string ipfsHash, string name, string reason);

    function setUp() public {
        uint8 numVotesRequired = 2;

        agentTokenCreator = new AgentTokenCreator(
            agents, numVotesRequired, address(zoraContract), fixedPriceMinter, createRef, startTime
        );

        vm.prank(agents[0]);
        zoraContract.addPermission(0, address(agentTokenCreator), 2);

        vm.prank(agents[0]);
        zoraContract.addPermission(0, fixedPriceMinter, 4);
    }

    function testFailInitializationNoAgents() public {
        address[] memory emptyAgents;
        new AgentTokenCreator(emptyAgents, 1, address(zoraContract), fixedPriceMinter, createRef, startTime);
    }

    function testFailInitializationInvalidVotesRequired() public {
        new AgentTokenCreator(agents, 4, address(zoraContract), fixedPriceMinter, createRef, startTime);
    }

    function testFailInitializationDuplicateAgent() public {
        address[] memory duplicateAgents = new address[](2);
        duplicateAgents[0] = address(0x1);
        duplicateAgents[1] = address(0x1);
        new AgentTokenCreator(duplicateAgents, 1, address(zoraContract), fixedPriceMinter, createRef, startTime);
    }

    function testCreateToken() public {
        uint256 tokenId = zoraContract.nextTokenId();
        string memory ipfsHash = "QmFirstOptionHash";
        string memory reason = "Reason";
        string memory name = "Name";

        AgentTokenCreator.VoteOption memory firstOption =
            AgentTokenCreator.VoteOption({name: "Option 1", ipfsHash: "QmFirstOptionHash"});

        AgentTokenCreator.VoteOption memory secondOption =
            AgentTokenCreator.VoteOption({name: "Option 2", ipfsHash: "QmSecondOptionHash"});

        vm.prank(agents[0]);
        agentTokenCreator.startTokenVote(tokenId, firstOption, secondOption);

        vm.prank(agents[0]);
        agentTokenCreator.submitTokenVote(tokenId, ipfsHash, name, reason);

        vm.prank(agents[1]);
        agentTokenCreator.submitTokenVote(tokenId, ipfsHash, name, reason);

        vm.prank(agents[2]);
        agentTokenCreator.submitTokenVote(tokenId, ipfsHash, name, reason);

        vm.prank(agents[0]);
        agentTokenCreator.createToken(tokenId, ipfsHash);
    }

    function testFailNotEnoughTime() public {
        uint256 tokenId = zoraContract.nextTokenId();
        string memory ipfsHash = "QmHashExample";
        string memory reason = "Reason";
        string memory name = "Name";

        vm.prank(agents[0]);
        agentTokenCreator.submitTokenVote(tokenId, ipfsHash, name, reason);

        vm.prank(agents[1]);
        agentTokenCreator.submitTokenVote(tokenId, ipfsHash, name, reason);

        vm.prank(agents[2]);
        agentTokenCreator.submitTokenVote(tokenId, ipfsHash, name, reason);

        vm.prank(agents[0]);
        agentTokenCreator.createToken(tokenId, ipfsHash);

        uint256 nextTokenId = (tokenId + 1);

        vm.prank(agents[0]);
        agentTokenCreator.submitTokenVote(nextTokenId, ipfsHash, name, reason);

        vm.prank(agents[1]);
        agentTokenCreator.submitTokenVote(nextTokenId, ipfsHash, name, reason);

        vm.prank(agents[0]);
        agentTokenCreator.createToken(nextTokenId, "QmHashExample");

        uint256 canCreateTokenAt = agentTokenCreator.canCreateTokenAt();
        assertEq(canCreateTokenAt, startTime + 2 days);
    }

    function testStartTokenVote() public {
        uint256 tokenId = zoraContract.nextTokenId();

        AgentTokenCreator.VoteOption memory firstOption =
            AgentTokenCreator.VoteOption({name: "Option 1", ipfsHash: "QmFirstOptionHash"});

        AgentTokenCreator.VoteOption memory secondOption =
            AgentTokenCreator.VoteOption({name: "Option 2", ipfsHash: "QmSecondOptionHash"});

        vm.prank(agents[0]);
        agentTokenCreator.startTokenVote(tokenId, firstOption, secondOption);

        bool isVoteCreated = agentTokenCreator.voteCreated(tokenId);
        assertTrue(isVoteCreated);
    }

    function testFailNotEnoughVotes() public {
        uint256 tokenId = zoraContract.nextTokenId() + 1;

        vm.prank(agents[0]);
        agentTokenCreator.submitTokenVote(tokenId, "QmHashExample", "Name", "Reason");

        vm.warp(block.timestamp + 1 days);
        vm.prank(agents[0]);
        agentTokenCreator.createToken(tokenId, "QmHashExample");
    }

    function testFailInvalidTokenIdCreateToken() public {
        uint256 tokenId = zoraContract.nextTokenId() + 1;
        vm.prank(agents[0]);
        agentTokenCreator.createToken(tokenId, "QmHashExample");
    }

    function testSubmitVote() public {
        uint256 tokenId = zoraContract.nextTokenId();

        AgentTokenCreator.VoteOption memory firstOption =
            AgentTokenCreator.VoteOption({name: "Option 1", ipfsHash: "QmFirstOptionHash"});

        AgentTokenCreator.VoteOption memory secondOption =
            AgentTokenCreator.VoteOption({name: "Option 2", ipfsHash: "QmSecondOptionHash"});

        vm.prank(agents[0]);
        agentTokenCreator.startTokenVote(tokenId, firstOption, secondOption);

        vm.prank(agents[0]);
        agentTokenCreator.submitTokenVote(tokenId, "QmHashExample", "Name", "Reason");
        bool voted = agentTokenCreator.hasVoted(tokenId, agents[0]);
        assertTrue(voted);
    }

    function testFailOnlyAgentVote() public {
        vm.prank(address(0x3)); // Not an agent
        agentTokenCreator.submitTokenVote(1, "QmHashExample", "Name", "Reason");
    }

    function testFailAlreadyVotedForToken() public {
        uint256 tokenId = zoraContract.nextTokenId();
        vm.prank(agents[0]);
        agentTokenCreator.submitTokenVote(tokenId, "QmHashExample", "Name", "Reason");

        vm.prank(agents[0]);
        agentTokenCreator.submitTokenVote(tokenId, "QmHashExample", "Name", "Reason");
    }

    function testFailVoteInvalidTokenId() public {
        uint256 tokenId = zoraContract.nextTokenId() + 1;
        vm.prank(agents[0]);
        agentTokenCreator.submitTokenVote(tokenId, "QmHashExample", "Name", "Reason");
    }

    function testVoteSubmittedEvent() public {
        uint256 tokenId = zoraContract.nextTokenId();

        AgentTokenCreator.VoteOption memory firstOption =
            AgentTokenCreator.VoteOption({name: "Option 1", ipfsHash: "QmFirstOptionHash"});

        AgentTokenCreator.VoteOption memory secondOption =
            AgentTokenCreator.VoteOption({name: "Option 2", ipfsHash: "QmSecondOptionHash"});

        vm.prank(agents[0]);
        agentTokenCreator.startTokenVote(tokenId, firstOption, secondOption);

        vm.expectEmit(true, true, true, true);
        emit VoteSubmitted(agents[0], tokenId, "QmHashExample", "Name", "Reason");

        vm.prank(agents[0]);
        agentTokenCreator.submitTokenVote(tokenId, "QmHashExample", "Name", "Reason");
    }
}
