(function(exports){
    'use strict';
    
    exports.GeneratedEngagement = React.createClass({
        
        render: function(){
            /*
                {
                    tweetMine: TweetMine
                }
            */
            const data = this.props;
            
            const {tweetMine} = data;
            
            return React.DOM.div( {className: "all-metrics"}, [
                Metrics({
                    name: 'Retweets',
                    values : [{
                            percent: tweetMine.getGeneratedRetweetsCount()*100/tweetMine.length
                        }
                    ]
                }),
                Metrics({
                    name: 'Favorites',
                    values : [{
                            percent: tweetMine.getGeneratedFavoritesCount()*100/tweetMine.length
                        }
                    ]
                })
                
                /*,
                Holding off replies for now as the count is going to be fairly hard to get https://github.com/DavidBruant/Twitter-Assistant/issues/14
                
                
                Metrics({
                    name: 'Replies',
                    values : [{
                            percent: tweetMine.getGeneratedReplies().length*100/tweetMine.length
                        }
                    ]
                })*/
            ]);
        }
    });
        
})(this);
