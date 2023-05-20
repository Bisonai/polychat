// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract DAO {
    struct Proposal {
        address proposer;
        uint256 votes;
        uint256 minVotesRequired;
        uint256 votingPeriod;
        uint256 creationTime;
        bool executed;
    }

    address public owner;
    uint256 public totalProposals;
    mapping(uint256 => Proposal) public proposals;
    mapping(address => mapping(uint256 => bool)) public hasVoted;
    mapping(address => bool) public members;

    event ProposalCreated(uint256 proposalId, address proposer);
    event Voted(uint256 proposalId, address voter);
    event ProposalExecuted(uint256 proposalId);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not the owner");
        _;
    }

    constructor() {
        owner = msg.sender;
        members[msg.sender] = true;
    }

    modifier onlyMembers() {
        require(members[msg.sender], "Not a member");
        _;
    }

    function createProposal(uint256 minVotesRequired_, uint256 votingPeriod_) external onlyMembers {
        uint256 proposalId_ = totalProposals;
        proposals[proposalId_] = Proposal(
            msg.sender,
            0,
            minVotesRequired_,
            votingPeriod_,
            block.timestamp,
            false
        );
        totalProposals++;
        emit ProposalCreated(proposalId_, msg.sender);
    }

    function vote(uint256 proposalId_) external onlyMembers {
        require(!hasVoted[msg.sender][proposalId_], "Already voted");
        require(
            block.timestamp <
                proposals[proposalId_].creationTime + proposals[proposalId_].votingPeriod,
            "Voting period has ended"
        );

        proposals[proposalId_].votes++;
        hasVoted[msg.sender][proposalId_] = true;
        emit Voted(proposalId_, msg.sender);
    }

    function executeProposal(uint256 proposalId_) external onlyMembers {
        require(
            proposals[proposalId_].votes >= proposals[proposalId_].minVotesRequired,
            "Insufficient votes"
        );
        require(!proposals[proposalId_].executed, "Already executed");

        proposals[proposalId_].executed = true;
        emit ProposalExecuted(proposalId_);
    }

    function addMember(address member_) external onlyOwner {
        require(!members[member_], "Member already exists");
        members[member_] = true;
    }

    function removeMember(address member_) external onlyOwner {
        require(members[member_], "Member does not exist");
        require(member_ != owner, "Cannot remove the owner");
        members[member_] = false;
    }
}
