import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract'
import taskMasterArtifacts from '../../build/contracts/TaskMaster.json'

var TaskMaster = contract(taskMasterArtifacts);
var ownerAccount;

window.TaskMasterApp = {
    setWeb3Provider: function() {
        TaskMaster.setProvider(web3.currentProvider);
    },

    refreshAccountBalance: function() {
        var self = this;

        TaskMaster.deployed()
            .then(function(taskMasterInstance) {
                return taskMasterInstance.getBalance.call(ownerAccount, {
                from: ownerAccount
                });
            }).then(function(value) {
                document.getElementById("accountBalance").innerHTML = value.valueOf();
                document.getElementById("accountBalance").style.color = "white";
            }).catch(function(e){
                console.log(e);
            });
    },

    getAccounts: function() {
        var self = this;
        web3.eth.getAccounts(function(error, accounts) {
            if (error != null) {
                alert("Sorry, something went wrong. We couldn't fetch your accounts.");
                return;
            }

            if (!accounts.length) {
                alert("Sorry, no errors, but we coudn't get any accounts - Make sure your Ethereum client is configured correctly.");
                return;
            }

            ownerAccount = accounts[1];
            self.refreshAccountBalance();
        });
    },

    rewardDoer: function() {
        var self = this;

        var todoCoinReward = +document.getElementById("todoCoinReward").value;
        var doer = document.getElementById("doer").value;

        TaskMaster.deployed()
            .then(function(taskMasterInstance) {
                return taskMasterInstance.reward(doer, todoCoinReward, {
                    from: ownerAccount
                });
            }).then(function() {
                //self.updateTransactionStatus("Transaction complete!");
                self.refreshAccountBalance();
            }).catch(function(e) {
                console.log(e);
                //self.updateTransactionStatus("Error sending reward - see console.");
            });
        },
};

window.addEventListener('load', function() {
    window.web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:9545"));
    TaskMasterApp.setWeb3Provider();
    TaskMasterApp.getAccounts();
});