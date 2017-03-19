var userApp = angular.module('userApp', ['ui.bootstrap','ngAnimate', 'ui.bootstrap', 'chart.js']);

userApp.factory('myService', function($http) {
    var promise;
    var myService = {
        async: function() {
            if ( !promise ) {
                promise = $http.get('https://randomuser.me/api/?results=5000').then(function (response) {
                    return response.data.results;
                });
            }
            return promise;
        }
    };
    return myService;
});

userApp.controller('userCtrl', function( myService,$scope) {
    $scope.getData = function() {
        myService.async().then(function(d) {
        $scope.users = d;
        for(var i = 0; i < $scope.users.length; i++) {
                function capitalizeUserData(firstName, lastName) {
                    $scope.users[i].name.first = firstName.charAt(0).toUpperCase() + firstName.slice(1);
                    $scope.users[i].name.last = lastName.charAt(0).toUpperCase() + lastName.slice(1);
                }
                capitalizeUserData($scope.users[i].name.first, $scope.users[i].name.last);

                function formatDate(regDate, birthDate){
                    var r = new Date(regDate);
                    var b = new Date(birthDate);
                    $scope.users[i].registered = [r.getMonth()+1, r.getDate(), r.getFullYear()].join('/');
                    $scope.users[i].dob = [b.getMonth()+1, b.getDate(), b.getFullYear()].join('/');
                }
                formatDate($scope.users[i].registered, $scope.users[i].dob);
            }
        // console.log($scope.users);
        });
    };
    $scope.getData();
});

userApp.controller('AccordionCtrl', function($scope) {
    $scope.oneAtATime = true;
    $scope.status = {
        isCustomHeaderOpen: false,
        isFirstOpen: false
    };
});

userApp.controller('ModalDemoCtrl', function($uibModal, $log, $document) {
    var $ctrl = this;
    $ctrl.items = ['item1', 'item2', 'item3'];
    $ctrl.animationsEnabled = true;
    $ctrl.open = function (size, parentSelector) {
        var parentElem = parentSelector ?
            angular.element($document[0].querySelector('.modal-demo ' + parentSelector)) : undefined;
        var modalInstance = $uibModal.open({
            animation: $ctrl.animationsEnabled,
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: 'myModalContent.html',
            controller: 'ModalInstanceCtrl',
            controllerAs: '$ctrl',
            size: size,
            appendTo: parentElem,
            resolve: {
                items: function () {
                    return $ctrl.items;
                }
            }
        });
    };
    $ctrl.toggleAnimation = function () {
        $ctrl.animationsEnabled = !$ctrl.animationsEnabled;
    };
});

userApp.controller('ModalInstanceCtrl', function ($uibModalInstance, items) {
    var $ctrl = this;
    $ctrl.items = items;
    $ctrl.selected = {
        item: $ctrl.items[0]
    };
    $ctrl.ok = function () {
        $uibModalInstance.close($ctrl.selected.item);
    };
});


userApp.controller("PieCtrl", function (myService, $scope) {
    myService.async().then(function(d) {
        $scope.users = d;
        $scope.genderUsersCount = function () {
            var countMale = 0;
            var countFemale = 0;
            angular.forEach($scope.users, function (user) {
                countMale += user.gender == 'male' ? 1 : 0;
                countFemale += user.gender == 'female' ? 1 : 0;
            });
            return [countMale, countFemale];
        }
        var userGender = $scope.genderUsersCount();
        $scope.countMale = (userGender[0]*100)/$scope.users.length;
        $scope.countFemale = (userGender[1]*100)/$scope.users.length;
        $scope.labels = ["Male Users", "Female Users"];
        $scope.data = [$scope.countMale, $scope.countFemale];
        var theHelp = Chart.helpers;
        $scope.options = {
            tooltips: {
                callbacks: {
                    label: function(tooltipItem, data) {
                        var dataset = data.datasets[tooltipItem.datasetIndex];
                        var total = dataset.data.reduce(function(previousValue, currentValue, currentIndex, array) {
                            return previousValue + currentValue;
                        });
                        var currentValue = dataset.data[tooltipItem.index];
                        var precentage = ((currentValue/total) * 100);
                        return precentage + "%";
                    }
                }
            },
            legend: {
                display: true,
                position: 'bottom',
                labels: {
                    generateLabels: function(chart) {
                        var data = chart.data;
                        if (data.labels.length && data.datasets.length) {
                            return data.labels.map(function(label, i) {
                                var meta = chart.getDatasetMeta(0);
                                var ds = data.datasets[0];
                                var arc = meta.data[i];
                                var custom = arc && arc.custom || {};
                                var getValueAtIndexOrDefault = theHelp.getValueAtIndexOrDefault;
                                var arcOpts = chart.options.elements.arc;
                                var fill = custom.backgroundColor ? custom.backgroundColor : getValueAtIndexOrDefault(ds.backgroundColor, i, arcOpts.backgroundColor);
                                var stroke = custom.borderColor ? custom.borderColor : getValueAtIndexOrDefault(ds.borderColor, i, arcOpts.borderColor);
                                var bw = custom.borderWidth ? custom.borderWidth : getValueAtIndexOrDefault(ds.borderWidth, i, arcOpts.borderWidth);
                                return {
                                    text: ds.data[i] + "% " + label,
                                    fillStyle: fill,
                                    strokeStyle: stroke,
                                    lineWidth: bw,
                                    hidden: isNaN(ds.data[i]) || meta.data[i].hidden,
                                    index: i
                                };
                            });
                        }
                        return [];
                    }
                }
            },
        }
    });
});

userApp.controller('paginationCtrl', ['$scope', '$filter', function ($scope, $filter) {
    $scope.currentPage = 0;
    $scope.pageSize = 10;
    $scope.data = [];
    $scope.q = '';
    $scope.getData = function () {
        console.log();
        return $filter('filter')($scope.data, $scope.q)
    }
    $scope.numberOfPages = function () {
        return Math.ceil($scope.getData().length / $scope.pageSize);
    }
    for (var i = 0; i < 5000; i++) {
        $scope.data.push("Item " + i);
    }
}]);


userApp.filter('startFrom', function () {
    return function (input, start) {
        if (input) {
            start = +start;
            return input.slice(start);
        }
        return [];
    };
});



