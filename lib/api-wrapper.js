'use strict';

var ApiWrapper = function (mcapi, apiKey, listId, logger) {
    logger = logger || require('winston');
    
    var mc = new mcapi.Mailchimp(apiKey);

    this.lists = function () {
        mc.lists.list(
            {filters: {list_name: 'prova'}}, 
            function (data) {
                logger.info('lists return data', data);
            }, function (error) {
                logger.error('lists error', error);
            });
    };

    this.members = function () {
        mc.lists.members(
            {id: listId}, 
            function (data) {
                logger.info('members return data', data);
            }, function (error) {
                logger.error('members error', error);
            });
    };

    this.subscribe = function (user) {
        if (user) {
            mc.lists.subscribe({
                id: listId, 
                email:{email: user.email},
                merge_vars: { FNAME: user.name, LNAME: user.surname},
                double_optin: false,
            }, function (data) {
                logger.info('subscribe return data', data);                
            }, function (error) {
                logger.error('subscribe error', error);
            });            
        }
    };

    this.batchSubscribe = function (users) {
        mc.lists.batchSubscribe({
            id: listId, 
            batch: users.filter(isValidElement).map(toMcObject),
            double_optin: false,
        }, function(data) {
            logger.info('batch-subscribe return data', data);  
        }, function (error) {
            logger.error('batch-subscribe error', error);
        });
    };

    this.isValidElement = function (element) {
        return element !== undefined && element.email !== undefined;
    };

    this.toMcObject = function (user) {
        var result = {
            email: {email: user.email},
            merge_vars: {}
        };
        if (user.name)
            result.merge_vars.FNAME = user.name;
        if (user.surname)
            result.merge_vars.LNAME = user.surname;
        if (JSON.stringify(result.merge_vars) == '{}')
            delete result.merge_vars;

        return result;
    };
};

module.exports = ApiWrapper;