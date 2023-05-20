//SPDX-License-Identifier: BUSL
pragma solidity ^0.8.16;

contract FactoryAdRevenueSharing {
    address immutable operator;
    uint8 operatorFee;

    mapping(bytes32 => AdRevenueShare) public adRegistry;
    mapping(address => bytes32) public adOperator;

    uint256 feeBalance;

    error NotOperator();
    error FailedToWithdraw();

    constructor() {
        operator = msg.sender;
    }

    modifier onlyOperator() {
        if (msg.sender != operator) {
            revert NotOperator();
        }
        _;
    }

    function create(
        bytes32 adHash_
    ) public {
        AdRevenueShare _ad = new AdRevenueShare(adHash_);
        adRegistry[adHash_] = _ad;

        adOperator[msg.sender] = adHash_;
    }

    function launchCampaign(bytes32 adHash_, uint256 toBlockTimestamp_) external payable {
        AdRevenueShare ad = adRegistry[adHash_];
        require(address(ad) != address(0));
        require(adOperator[msg.sender] == adHash_);

        uint256 factor = 100;
        uint256 _operatorFee = (operatorFee * factor * msg.value) / (100 * factor);

        feeBalance += _operatorFee;
        uint256 left = msg.value - _operatorFee;

        ad.launchCampaign{value: left}(toBlockTimestamp_);
    }

    function setOperatorFee(uint8 operatorFee_) external onlyOperator {
        require(operatorFee_ > 0 && operatorFee_ <= 100);
        operatorFee = operatorFee_;
    }

    function withtdrawFees(address payable to, uint256 tokenAmount_) external onlyOperator {
        feeBalance -= tokenAmount_;

        (bool sent, ) = to.call{value: tokenAmount_}("");
        if (!sent) {
            revert FailedToWithdraw();
        }
    }
}

contract AdRevenueShare {
    address campaignOperator;
    uint256 fromBlockTimestamp;
    uint256 toBlockTimestamp;

    uint256 stakePoolBalance;
    uint256 adCampaignBalance;

    bytes32 public adHash;

    address registry;

    mapping(address => uint256) userStake;

    error FailedToUnstake();
    error NotRegistry();

    modifier onlyRegistry() {
        if (msg.sender != registry) {
            revert NotRegistry();
        }
        _;
    }

    constructor(
        bytes32 adHash_
    ) {
        adHash = adHash_;
        campaignOperator = msg.sender;
        registry = msg.sender;
    }

    function launchCampaign(
        uint256 toBlockTimestamp_
    ) public payable onlyRegistry {
        require(adCampaignBalance == 0);
        require(fromBlockTimestamp < toBlockTimestamp);
        require(msg.value > 0);

        fromBlockTimestamp = block.timestamp;
        toBlockTimestamp = toBlockTimestamp_;
        adCampaignBalance = msg.value;
    }

    function stake() public payable {
        require(block.timestamp > fromBlockTimestamp && block.timestamp < toBlockTimestamp);
        require(msg.value > 0);
        stakePoolBalance += msg.value;
    }

    function unstake() public {
        require(block.timestamp >= toBlockTimestamp);

        uint _userStake = userStake[msg.sender];
        require(_userStake > 0);
        userStake[msg.sender] = 0;

        // receive add revenue proportional to stake
        uint _adRevenue = (_userStake * adCampaignBalance) / stakePoolBalance;

        uint256 _reward = _userStake + _adRevenue;
        (bool sent, ) = payable(address(this)).call{value: _reward}("");
        if (!sent) {
            revert FailedToUnstake();
        }
    }
}
