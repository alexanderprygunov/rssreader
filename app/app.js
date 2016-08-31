var App = angular.module('RssReaderApp', []);

App.controller("RssCtrl", ['$scope', 'RssService', '$window', '$sce', function($scope, $rssService, $window, $sce){

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

    $scope.showFeedList = function (category) {
        $scope.news = [];
        $scope.feedListActiveCategory = category.id;
        $scope.feedList = category.items;
    };

    $scope.addFeed = function () {
        $scope.getCategoryById(feedCategory.value);
        currentCategory.items.push({
            name: $scope.feedName,
            link: $scope.feedLink
        });
    };

    $scope.deleteFeed = function (feedItem) {
        currentFeedCategory = $scope.getCategoryById($scope.feedListActiveCategory);
        currentFeedCategory.items.splice(currentFeedCategory.items.indexOf(feedItem), 1);
    };

    $scope.loadNews = function(feedItemLink) {
        $rssService.parseFeed(feedItemLink).then(function(res){
            $scope.news = res.data.responseData.feed.entries;
            for (var i = 0; i < $scope.news.length; i++) {
                $scope.news[i].dateConverted = new Date($scope.news[i].publishedDate);
            }
        });
    };

    $scope.setDescriptionStatus = function (newsItem) {
        var statusClass = 'state-active';

        if (newsItem.status != statusClass) {
            newsItem.status = statusClass;
        }
        else {
            newsItem.status = '';
        }
    };

    $scope.renderHtml = function (html) {
        return $sce.trustAsHtml(html);
    };

    $window.onunload = function () {
        localStorage.setItem('categories', JSON.stringify($scope.categories));
    };

}]);

App.factory('RssService', ['$http', function($http){
    return {
        parseFeed : function(url){
            return $http.jsonp('//ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=100&callback=JSON_CALLBACK&q=' + encodeURIComponent(url));
        }
    }
}]);