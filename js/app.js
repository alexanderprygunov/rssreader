var App = angular.module('RssReaderApp', []);

App.controller("RssCtrl", ['$scope', 'RssService', '$window', '$sce', function($scope, $rssService, $window, $sce){

    $scope.categories = JSON.parse(localStorage.getItem('categories'));
    $scope.viewedNews = JSON.parse(localStorage.getItem('viewedNews'));

    $scope.categories = ($scope.categories !== null) ? $scope.categories : [];
    $scope.viewedNews = ($scope.viewedNews !== null) ? $scope.viewedNews : [];

    $scope.colors = {
        1: 'red',
        2: 'orange',
        3: 'yellow',
        4: 'green',
        5: 'cyan',
        6: 'blue',
        7: 'purple'
    };

    $scope.defaultColor = $scope.colors[1];
    $scope.categoryColor = $scope.defaultColor;

    $scope.setCategoryColor = function(colorId) {
        $scope.categoryColor = $scope.colors[colorId];
    };

    $scope.modalTitle = 'Добавление новой ленты';
    $scope.modalAddButton = false;
    $scope.modalEditButton = false;

    $scope.selectCategoriesActivityFalse = function () {
        var categoriesList = $scope.categories;
        for (var i = categoriesList.length - 1; i >= 0; i--) {
            categoriesList[i].active = false;
        }
    };

    $scope.selectCategoriesActivityFalse();

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
        $scope.deleteCategoryAlert = "";
        if(category.items.length > 0) {
            $scope.deleteCategoryAlert = "Невозможно удалить группу \"" + category.name + "\", в ней есть активные ленты.";
        } else {
            $scope.categories.splice($scope.categories.indexOf(category), 1);
        }
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
        $scope.selectCategoriesActivityFalse();
        category.active = true;
        $scope.news = [];
        $scope.feedListActiveCategory = category.id;
        $scope.feedList = category.items;
    };

    $scope.addFeed = function () {
        $scope.feedName = '';
        $scope.feedLink = '';
        $scope.modalEditButton = false;
        $scope.modalAddButton = true;
    };

    $scope.addFeedSuccess = function () {
        $scope.getCategoryById(feedCategory.value);
        currentCategory.items.push({
            name: $scope.feedName,
            link: $scope.feedLink
        });
    };

    $scope.editFeed = function (feedItem) {
        $scope.modalTitle = 'Редактирование ленты';
        $scope.modalEditButton = true;
        $scope.modalAddButton = false;
        $scope.feedName = feedItem.name;
        $scope.feedLink = feedItem.link;
        $scope.feedCategory = $scope.getCategoryById($scope.feedListActiveCategory);
        $scope.currentFeed = feedItem;
    };

    $scope.editFeedSuccess = function () {
        console.log($scope.currentFeed);
        if($scope.feedCategory.id != $scope.feedListActiveCategory) {
            $scope.deleteFeed($scope.currentFeed);
            $scope.addFeedSuccess();
        } else {
            $scope.currentFeed.name = $scope.feedName;
            $scope.currentFeed.link = $scope.feedLink;
        }
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

                $scope.news[i].viewed = "";
                if ($scope.viewedNews.indexOf($scope.news[i].link) > -1) {
                    $scope.news[i].viewed = "Прочитано";
                }

            }
        });
    };

    $scope.setDescriptionStatus = function (newsItem, index) {
        var statusClass = 'state-active';

        if ($scope.viewedNews.indexOf(newsItem.link) < 0) {
            $scope.viewedNews.push(newsItem.link);
            $scope.news[index].viewed = "Прочитано";
        }

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
        localStorage.setItem('viewedNews', JSON.stringify($scope.viewedNews));
    };

}]);
App.factory('RssService', ['$http', function($http){
    return {
        parseFeed : function(url){
            return $http.jsonp('//ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=100&callback=JSON_CALLBACK&q=' + encodeURIComponent(url));
        }
    }
}]);