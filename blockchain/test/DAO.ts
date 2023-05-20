import { ethers } from 'hardhat'
import { Contract, Signer } from 'ethers'
import { expect } from 'chai'

describe('DAO Contract', function () {
  let dao: Contract
  let owner: Signer
  let member1: Signer
  let member2: Signer

  beforeEach(async function () {
    ;[owner, member1, member2] = await ethers.getSigners()

    const DAOContract = await ethers.getContractFactory('DAO')
    dao = await DAOContract.connect(owner).deploy()
    await dao.deployed()
  })

  it('should add a member', async function () {
    const addMemberTx = await dao.connect(owner).addMember(await member1.getAddress())
    await addMemberTx.wait()

    expect(await dao.members(await member1.getAddress())).to.equal(true)
  })

  it('should remove a member', async function () {
    await dao.connect(owner).addMember(await member1.getAddress())

    const removeMemberTx = await dao.connect(owner).removeMember(await member1.getAddress())
    await removeMemberTx.wait()

    expect(await dao.members(await member1.getAddress())).to.equal(false)
  })

  it('should create a proposal', async function () {
    await dao.connect(owner).addMember(await member1.getAddress())

    const createProposalTx = await dao.connect(member1).createProposal(2, 7)
    const createProposalTxReceipt = await createProposalTx.wait()

    const proposalId = createProposalTxReceipt.events[0].args[0]
    const proposal = await dao.proposals(proposalId)

    expect(proposal.proposer).to.equal(await member1.getAddress())
    expect(proposal.votes).to.equal(0)
    expect(proposal.minVotesRequired).to.equal(2)
    expect(proposal.votingPeriod).to.equal(7)
    expect(proposal.executed).to.equal(false)
  })

  it('should vote on a proposal', async function () {
    await dao.connect(owner).addMember(await member1.getAddress())
    await dao.connect(owner).addMember(await member2.getAddress())

    const createProposalTx = await dao.connect(member1).createProposal(2, 7)
    const createProposalTxReceipt = await createProposalTx.wait()

    const proposalId = createProposalTxReceipt.events[0].args[0]

    const voteTx1 = await dao.connect(member1).vote(proposalId)
    await voteTx1.wait()

    const voteTx2 = await dao.connect(member2).vote(proposalId)
    await voteTx2.wait()

    const proposal = await dao.proposals(proposalId)

    expect(proposal.votes).to.equal(2)
    expect(await dao.hasVoted(await member1.getAddress(), proposalId)).to.equal(true)
    expect(await dao.hasVoted(await member2.getAddress(), proposalId)).to.equal(true)
  })

  it('should execute a proposal', async function () {
    await dao.connect(owner).addMember(await member1.getAddress())
    await dao.connect(owner).addMember(await member2.getAddress())

    const createProposalTx = await dao.connect(member1).createProposal(2, 7)
    const createProposalTxReceipt = await createProposalTx.wait()

    const proposalId = createProposalTxReceipt.events[0].args[0]

    await dao.connect(member1).vote(proposalId)
    await dao.connect(member2).vote(proposalId)

    const executeProposalTx = await dao.connect(member1).executeProposal(proposalId)
    await executeProposalTx.wait()

    const proposal = await dao.proposals(proposalId)

    expect(proposal.executed).to.equal(true)
  })
})
