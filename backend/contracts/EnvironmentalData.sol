// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract EnvironmentalData {
    struct Data {
        string parcelId;
        uint256 timestamp;
        uint256 waterConsumption;
        uint256 energyConsumption;
        uint256 co2Emissions;
        uint256 pesticideUsage;
        uint256 productQuantity;
        string qrCode;
    }

    mapping(string => Data) public dataRecords;
    address public owner;

    event DataRecorded(
        string parcelId,
        uint256 timestamp,
        string qrCode
    );

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    function recordData(
        string memory _parcelId,
        uint256 _waterConsumption,
        uint256 _energyConsumption,
        uint256 _co2Emissions,
        uint256 _pesticideUsage,
        uint256 _productQuantity,
        string memory _qrCode
    ) public onlyOwner {
        Data memory newData = Data({
            parcelId: _parcelId,
            timestamp: block.timestamp,
            waterConsumption: _waterConsumption,
            energyConsumption: _energyConsumption,
            co2Emissions: _co2Emissions,
            pesticideUsage: _pesticideUsage,
            productQuantity: _productQuantity,
            qrCode: _qrCode
        });

        dataRecords[_parcelId] = newData;
        emit DataRecorded(_parcelId, block.timestamp, _qrCode);
    }

    function getData(string memory _parcelId) public view returns (
        string memory,
        uint256,
        uint256,
        uint256,
        uint256,
        uint256,
        uint256,
        string memory
    ) {
        Data memory data = dataRecords[_parcelId];
        return (
            data.parcelId,
            data.timestamp,
            data.waterConsumption,
            data.energyConsumption,
            data.co2Emissions,
            data.pesticideUsage,
            data.productQuantity,
            data.qrCode
        );
    }
} 