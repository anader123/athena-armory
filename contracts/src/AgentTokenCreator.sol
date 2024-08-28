// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface IZoraContract {
    function nextTokenId() external view returns (uint256);
    function multicall(bytes[] calldata data) external;
}

contract AgentTokenCreator {
    error NotAnAgent();
    error AgentsRequired();
    error InvalidNumberOfRequiredVotes();
    error AgentNotUnique();
    error AlreadyVotedForToken();
    error InvalidTokenId(uint256 nextTokenId, uint256 paramTokenId);
    error NotEnoughTimeBetweenTokens(uint256 lastTokenCreatedAt);
    error NotEnoughVotes(uint8 currentVoteCount, uint256 tokenId);

    event VoteSubmitted(address indexed agent, uint256 indexed tokenId, string ipfsHash, string reason);

    uint8 public numVotesRequired;
    address[] public agents;
    IZoraContract public nftContract;
    address public fixedPriceMinter;
    uint256 public timeBetweenTokens = 1 days;
    uint256 public canCreateTokenAt;

    address createRef;
    bytes addPerms;
    bytes removePerms;

    mapping(address => bool) public isAgent;
    mapping(uint256 => mapping(address => bool)) public hasVoted;
    mapping(uint256 => mapping(string => uint8)) public tokenVotes;

    struct SalesConfig {
        uint64 saleStart;
        uint64 saleEnd;
        uint64 maxTokensPerAddress;
        uint96 pricePerToken;
        address fundsRecipient;
    }

    modifier onlyAgent() {
        require(isAgent[msg.sender], NotAnAgent());
        _;
    }

    constructor(
        address[] memory _agents,
        uint8 _numVotesRequired,
        address _nftContract,
        address _fixedPriceMinter,
        address _createRef,
        uint256 _startTime
    ) {
        require(_agents.length > 0, AgentsRequired());
        require(_numVotesRequired > 0 && _numVotesRequired <= _agents.length, InvalidNumberOfRequiredVotes());

        for (uint256 i = 0; i < _agents.length; i++) {
            address agent = _agents[i];

            require(!isAgent[agent], AgentNotUnique());

            isAgent[agent] = true;
            agents.push(agent);
            createRef = _createRef;
        }

        numVotesRequired = _numVotesRequired;
        nftContract = IZoraContract(_nftContract);
        fixedPriceMinter = _fixedPriceMinter;
        canCreateTokenAt = _startTime;
    }

    function submitTokenVote(uint256 tokenId, string memory ipfsHash, string memory reason) public onlyAgent {
        require(!hasVoted[tokenId][msg.sender], AlreadyVotedForToken());
        uint256 nextTokenId = nftContract.nextTokenId();
        require(nextTokenId == tokenId, InvalidTokenId(nextTokenId, tokenId));

        hasVoted[tokenId][msg.sender] = true;
        tokenVotes[tokenId][ipfsHash] += 1;

        emit VoteSubmitted(msg.sender, tokenId, ipfsHash, reason);
    }

    function createToken(uint256 tokenId, string memory ipfsHash) public onlyAgent {
        require(
            block.timestamp >= canCreateTokenAt, NotEnoughTimeBetweenTokens(canCreateTokenAt)
        );

        uint8 voteCount = tokenVotes[tokenId][ipfsHash];
        require(voteCount >= numVotesRequired, NotEnoughVotes(voteCount, tokenId));

        uint256 nextTokenId = nftContract.nextTokenId();

        require(nextTokenId == tokenId, InvalidTokenId(nextTokenId, tokenId));

        SalesConfig memory salesConfig = SalesConfig({
            saleStart: uint64(block.timestamp),
            saleEnd: uint64(block.timestamp + timeBetweenTokens),
            maxTokensPerAddress: uint64(0),
            pricePerToken: uint96(0),
            fundsRecipient: address(0)
        });

        bytes memory setSaleData = abi.encodeWithSelector(
            bytes4(keccak256("setSale(uint256,(uint64,uint64,uint64,uint96,address))")),
            nextTokenId,
            salesConfig.saleStart,
            salesConfig.saleEnd,
            salesConfig.maxTokensPerAddress,
            salesConfig.pricePerToken,
            salesConfig.fundsRecipient
        );

        bytes[] memory calls = new bytes[](4);

        calls[0] = abi.encodeWithSelector(
            bytes4(keccak256("setupNewTokenWithCreateReferral(string,uint256,address)")),
            string(abi.encodePacked("ipfs://", ipfsHash)),
            type(uint256).max,
            createRef
        );

        calls[1] = abi.encodeWithSelector(bytes4(keccak256("addPermission(uint256,address,uint256)")), tokenId, fixedPriceMinter, 4);

        calls[2] = abi.encodeWithSelector(
            bytes4(keccak256("callSale(uint256,address,bytes)")), tokenId, fixedPriceMinter, setSaleData
        );

        calls[3] = abi.encodeWithSelector(
            bytes4(keccak256("removePermission(uint256,address,uint256)")), tokenId, fixedPriceMinter, 4
        );

        nftContract.multicall(calls);
        canCreateTokenAt += timeBetweenTokens;
    }
}
