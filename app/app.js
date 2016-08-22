var App = angular.module('RssReaderApp', []);

App.controller("RssCtrl", ['$scope', '$window', function($scope, $window){

    $scope.categories = JSON.parse(localStorage.getItem('categories'));

    $scope.categories = ($scope.categories !== null) ? $scope.categories : [];

    $scope.colors = [
        'red',
        'orange',
        'yellow',
        'green',
        'cyan',
        'blue',
        'purple'
    ];

    $scope.defaultColor = $scope.colors[0];
    $scope.categoryColor = $scope.defaultColor;

    $scope.setCategoryColor = function(color) {
        $scope.categoryColor = color;
    };

    $scope.addCategory = function () {
        var categoryId = ($scope.categories.length > 0) ? ($scope.categories[$scope.categories.length - 1].id) + 1 : 1;
        $scope.categories.push({
            id: categoryId,
            name: $scope.categoryName,
            color: ($scope.categoryColor !== null) ? $scope.categoryColor : $scope.defaultColor,
            active: false,
            items: []
        });
        $scope.categoryName = '';
        $scope.categoryColor = $scope.defaultColor;
    };

    $scope.deleteCategory = function (category) {
        $scope.categories.splice($scope.categories.indexOf(category), 1);
    };

    $scope.getCategoryById = function (categoryId) {
        var categoriesList = $scope.categories;
        for (var i = categoriesList.length - 1; i >= 0; i--) {
            if (categoriesList[i].id == categoryId) {
                return currentCategory = categoriesList[i];
            }
        }
    };

    /*
    $scope.changeCategoryStatus = function (category) {

    };
    */

    $scope.addFeed = function () {
        $scope.getCategoryById(feedCategory.value);
        currentCategory.items.push({
            name: $scope.feedName,
            link: $scope.feedLink
        });
    };

    $window.onunload = function () {
        localStorage.setItem('categories', JSON.stringify($scope.categories));
    };

}]);


App.directive("ngEnter", function  () {
    return function (scope, elem) {
        $(elem).keyup(function  (e) {
            if (e.keyCode === 13) {
                scope.$apply(function  () {
                    scope.addCategory();
                });
            }
        });
    };
});





/*
App.controller("RssCtrl", ['$scope', 'RssService', function ($scope, Feed) {

    // add category
    $scope.savedCategory = localStorage.getItem('categoryList');
    $scope.categoryList = (localStorage.getItem('categoryList') !== null) ? JSON.parse($scope.savedCategory) : [];
    localStorage.setItem('categoryList', JSON.stringify($scope.categoryList));

    $scope.newCategory = null;

    $scope.addCategory = function () {
        $scope.categoryList.push({
            name: $scope.newCategory,
            color: $scope.newCategoryColor
        });
        $scope.newCategory = '';
        $scope.newCategoryColor = '';
        localStorage.setItem('categoryList', JSON.stringify($scope.categoryList));
    };

    // add feed
    $scope.savedFeed = localStorage.getItem('feedList');
    $scope.feedList = (localStorage.getItem('feedList') !== null) ? JSON.parse($scope.savedFeed) : [];
    localStorage.setItem('feedList', JSON.stringify($scope.feedList));

    $scope.newFeed = null;

    $scope.addFeed = function () {
        $scope.feedList.push({
            name: $scope.newFeed,
            link: $scope.newFeedLink,
            category: $scope.newFeedCategory.name
        });
        $scope.newFeed = '';
        $scope.newFeedLink = '';
        $scope.newFeedCategory = '';
        localStorage.setItem('feedList', JSON.stringify($scope.feedList));
    };

    // read rss
    $scope.loadFeed = function(e){
        Feed.parseFeed($scope.feedSrc).then(function(res){
            //console.log($scope.feedSrc);
            $scope.feeds = res.data.responseData.feed.entries;
        });
    };

}]);

App.factory('RssService',['$http',function($http){
    return {
        parseFeed : function(url){
            return $http.jsonp('//ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=100&callback=JSON_CALLBACK&q=' + encodeURIComponent(url));
        }
    }
}]);
*/