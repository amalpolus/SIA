var app = angular.module('siaApp', ['ui.router', 'ngSails']);

app.config(function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/home');

    $stateProvider
        .state('home', {
            url: '/home',
            templateUrl: 'index.html',
            controller: 'AuthController'

        })
        .state('dashboard', {

            url: '/dashboard/:user"',
            templateUrl: 'html/Dashboard.html',
            controller: 'dashboardController',
            // params: { user: null }
        })
        .state('apdashboard', {
            url: '/apDashboard/:role/:username',
            templateUrl: 'html/ApDashboard.html',
            controller: 'dashboardRoleController',

        })
        .state('approverdashboard', {
            url: '/Dashboard/:role/:username',
            templateUrl: 'html/ApproverDashboard.html',
            controller: 'dashboardRoleController',

        })
        .state('buyerdashboard', {
            url: '/buyDashboard/:role/:username',
            templateUrl: 'html/BuyerDashboard.html',
            controller: 'dashboardRoleController',

        })
        .state('view', {
            url: '/viewinvoice/:user/:invoice/:role',
            templateUrl: 'html/ViewInvoice.html',
            controller: 'ViewInvoiceController',
        })
    .state('approvedDoc', {
        url: '/approvedDoc/:invoice/:user',
        templateUrl: 'html/ApprovedInvoiceView.html',
        controller: 'ViewInvoiceController',
        // params: { invoiceid: null, invoice: null }
    })
    .state('reassign', {
        url: '/reassign/:invoice/:user',
        templateUrl: 'html/ReAssign.html',
        controller: 'ViewInvoiceController',
        // params: { invoiceid: null, invoice: null }
    })
});

//app.factory('userCheck', function ($http, $sails) {
//    var factory = {};

//    factory.userRole = function (user) {
//        $sails.get('/UsersList?UserName=' + user).then(function (data) {
//            var role = data.userdetails[0].Roles.role;
//            return role;
//        });
//    }
//   return factory;
//});

app.controller('AuthController', function ($scope, $sails, $location, $state) {
    $scope.loginCheck = function (data) {
        /*
        Authenticate the user
        */
        var user = data.username;
        var Mail = "abc@abcd.com";
        var location = "kerala";
        var phNo = "678984";

        $sails.get('/UserCheck?UserName=' + user + '&Mail=' + Mail + '&location' + location + '&phNo=' + phNo).then(function (usersdata) {
            var userCount = usersdata.userdetails[0];
            $state.go('dashboard', { user: userCount.UserName });

        });
    }
});
app.controller('dashboardController', function ($scope, $stateParams, $state, $sails, $timeout) {
    $scope.user = $stateParams.user;
    var checkrole = function (role) {
        switch (role) {
            case "admin":
                break;
            case "AP":
                $scope.ap = true;
                break;
            case "Buyer":
                $scope.buyer = true;
                break;
            default:
                //$scope.approver = true;
                break;
        }
    }
    var role = function (user) {
        $sails.get('/UsersList?UserName=' + user).then(function (data) {
            $scope.role = data.userdetails[0].Roles.role;
            if ($scope.role == undefined) {
                $scope.role = "Approver";
            }
            checkrole($scope.role);
        });
        
    }
    ///

    role($scope.user);
    ///
    $scope.gotoBuyer = function (user) {
        $state.go('buyerdashboard', { role: "Buyer", username: user });
    }
    $scope.gotoApprover = function (user) {
        $state.go('approverdashboard', { role: "Approver", username: user });
    }
    $scope.gotoAP = function (user) {
        $state.go('apdashboard', { role: "AP", username: user });
    }

});
app.controller('dashboardRoleController', function ($scope, $state, $sails, $stateParams) {
    var role = $stateParams.role;
    $scope.user = $stateParams.username;

    var buyerDash = function (user) {
        $sails.get('/Invoice?Buyer=' + user + '&Status=Approver Rejected').then(function (data) {
            $scope.invoices = data;
        });
    }
    $scope.apDash = function (status) {
        $sails.get('/Invoice?Status='+status).then(function (data) {
            $scope.invoices = data;
        });
    }
    var approveDash = function (user) {
        $sails.get('/Invoice?Approver='+ user+'&Status=Pending').then(function (data) {
            $scope.aprInvoices = data;
        });
    }
    if (role == "Buyer") {
        buyerDash($scope.user);
    }
    else if (role == "AP") {
        $scope.apDash('Pending');
    }
    else {
        approveDash($scope.user);
    }
});

app.controller('ViewInvoiceController', function ($scope, $state, $sails, $stateParams) {
    var id = $stateParams.invoice;
    $scope.user = $stateParams.user;
    var role = $stateParams.role;
    
    $sails.get('/Invoice?InvoiceNo=' + id).then(function (data) {
        $scope.invoiceSelected = data;
        $scope.invNo = $scope.invoiceSelected[0].InvoiceNo;
    });

    if (role == "Approver") {
        $scope.invoiceMsg = "Invoice Approval";
        $scope.approver = true;
    }
    else if (role == "Buyer") {
        $scope.invoiceMsg = "Not Approved";
        $scope.buyer = true;
    }
    else {
        $scope.invoiceMsg = "Service Invoice Approval";
    }

    $scope.rejectDocument = function () {
        $scope.reject = false;
        
        var id = $stateParams.invoice;;
        var role = $stateParams.role;
        $sails.post('/ChangeStatus?invoice=' + id + '&role=' + role + '&rejectReason=' + $scope.rejectReason).then(function (data) {
                var data = data;
            });
    }

    $scope.approvedDoc = function () {
        $state.go('approvedDoc', { invoice: $scope.id, user: $scope.user });
    }

    $scope.gotoReassign = function () {
        $state.go('reassign', { invoice: id, user: $scope.user });
    }
    $scope.searchresult = function () {

        var search = $scope.searchValue;
        $sails.get('/UsersList?Search=' + search).then(function (data) {
            $scope.serachMode = true;
            $scope.userSearched = [];
            $scope.userSearched = data.userdetails;
          
        });

    }

   
});

