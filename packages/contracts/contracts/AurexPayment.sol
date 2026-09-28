// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/// @title Aurex Payment Contract
/// @notice Handles usage-based payments, budget locking and refunds for Aurex.
contract AurexPayment is ReentrancyGuard {

    struct Service {
        uint256 id;
        string name;
        uint256 pricePerMinute;
        address payable provider;
        bool active;
    }

    struct Session {
        uint256 id;
        address payable user;
        uint256 serviceId;
        uint256 maxBudget;
        uint256 startTime;
        bool settled;
    }

    uint256 private nextServiceId = 1;
    uint256 private nextSessionId = 1;

    mapping(uint256 => Service) public services;
    mapping(uint256 => Session) public sessions;

    event ServiceRegistered(
        uint256 indexed serviceId,
        string name,
        uint256 pricePerMinute,
        address indexed provider
    );

    event BudgetLocked(
        uint256 indexed sessionId,
        address indexed user,
        uint256 indexed serviceId,
        uint256 amount
    );

    event SessionStarted(
        uint256 indexed sessionId,
        uint256 startTime
    );

    event SessionSettled(
        uint256 indexed sessionId,
        uint256 usageMinutes,
        uint256 providerPayment,
        uint256 userRefund
    );

    /// @notice Provider registers a digital service and its price.
    /// @param _name Name of the service.
    /// @param _pricePerMinute Price charged per minute in native MST units.
    function registerService(
        string calldata _name,
        uint256 _pricePerMinute
    ) external returns (uint256) {
        require(bytes(_name).length > 0, "Service name required");
        require(_pricePerMinute > 0, "Price must be greater than zero");

        uint256 serviceId = nextServiceId++;

        services[serviceId] = Service({
            id: serviceId,
            name: _name,
            pricePerMinute: _pricePerMinute,
            provider: payable(msg.sender),
            active: true
        });

        emit ServiceRegistered(
            serviceId,
            _name,
            _pricePerMinute,
            msg.sender
        );

        return serviceId;
    }

    /// @notice User locks the maximum budget for a service session.
    function lockBudget(
        uint256 _serviceId
    ) external payable nonReentrant returns (uint256) {
        Service memory service = services[_serviceId];

        require(service.active, "Service not active");
        require(msg.value > 0, "Budget must be greater than zero");

        uint256 sessionId = nextSessionId++;

        sessions[sessionId] = Session({
            id: sessionId,
            user: payable(msg.sender),
            serviceId: _serviceId,
            maxBudget: msg.value,
            startTime: block.timestamp,
            settled: false
        });

        emit BudgetLocked(
            sessionId,
            msg.sender,
            _serviceId,
            msg.value
        );

        emit SessionStarted(
            sessionId,
            block.timestamp
        );

        return sessionId;
    }

    /// @notice Settles the session using the usage duration submitted by the application.
    /// @dev The Aurex application records the actual usage duration.
    function settleSession(
        uint256 _sessionId,
        uint256 _usageMinutes
    ) external nonReentrant {
        Session storage session = sessions[_sessionId];

        require(session.user != address(0), "Session does not exist");
        require(!session.settled, "Session already settled");
        require(msg.sender == session.user, "Only session user can settle");

        Service memory service = services[session.serviceId];

        uint256 finalCost =
            _usageMinutes * service.pricePerMinute;

        require(
            finalCost <= session.maxBudget,
            "Usage cost exceeds locked budget"
        );

        uint256 refund =
            session.maxBudget - finalCost;

        session.settled = true;

        if (finalCost > 0) {
            (bool providerPaid, ) =
                service.provider.call{value: finalCost}("");

            require(providerPaid, "Provider payment failed");
        }

        if (refund > 0) {
            (bool userRefunded, ) =
                session.user.call{value: refund}("");

            require(userRefunded, "Refund failed");
        }

        emit SessionSettled(
            _sessionId,
            _usageMinutes,
            finalCost,
            refund
        );
    }

    /// @notice Returns service information.
    function getService(
        uint256 _serviceId
    )
        external
        view
        returns (
            uint256 id,
            string memory name,
            uint256 pricePerMinute,
            address provider,
            bool active
        )
    {
        Service memory service = services[_serviceId];

        return (
            service.id,
            service.name,
            service.pricePerMinute,
            service.provider,
            service.active
        );
    }

    /// @notice Returns session information.
    function getSession(
        uint256 _sessionId
    )
        external
        view
        returns (
            uint256 id,
            address user,
            uint256 serviceId,
            uint256 maxBudget,
            uint256 startTime,
            bool settled
        )
    {
        Session memory session = sessions[_sessionId];

        return (
            session.id,
            session.user,
            session.serviceId,
            session.maxBudget,
            session.startTime,
            session.settled
        );
    }
}