import React from 'react';
import logo from './logo.svg';
import './App.css';

function NewsItem(props) {
    let images;
    if (props.urlToImage){
	images = <img src={props.urlToImage} alt={props.url}/>
    }
    else
	images = "";
    return (
        <div className="news__item">
        <a className="news_class" href={props.url}>{props.title}<br/>{images}<br/> <hr/></a>
        </div>);
}

class News extends React.Component{
	constructor(props) {
		super(props);
		this.apiKey = 'a2e47115d1424ba98afeedef8beeed98';
		this.curPage = 0;
		this.endPage = 8;
		this.searchQuery = '';
		this.lastRequest = '';
		this.lastevent = '';
		this.loadMore = true;
		this.state = {
		    articles: [],
		    sources: []
		}
	}
	    
	componentDidMount() {
		var news_link = "https://newsapi.org/v2/sources?apiKey=" + this.apiKey;
		var request = new Request(news_link);
		fetch(request)
			.then((response) => {
				return response.json();
				})
			.then((data) => {
				this.setState({sources: data['sources']});
			});
	}
	
	get_cur_time(){
		let today = new Date();
		let dd = String(today.getDate()).padStart(2, '0');
		let mm = String(today.getMonth() + 1).padStart(2, '0');
		let yyyy = today.getFullYear();
		today = dd + '.' + mm + '.' + yyyy;
		return today;
	}
	
	handleSearchClick(e) {
		const req = e.target.value;
		const query = req.trim() ? `everything?q=${req}` : `top-headlines?country=us`;
		this.state.articles = [];
		this.curPage = 0;
		this.lastevent = query;
		this.searchQuery = query;
		this.add_news(`${this.lastevent}&pageSize=5&page=${this.curPage+1}&`);
	}
	
	handleSearchKeyUP(e) {
		if (e.keyCode === 13)
			this.handleSearchClick(e);
	}

	handleLoadMoreClick() {
		if (this.searchQuery === '')
			this.add_news(`everything?sources=${this.lastevent}&pageSize=5&page=${this.curPage+1}&`);
		else
			this.add_news(`${this.lastevent}&pageSize=5&page=${this.curPage+1}&`);
	}
	
	processArticles(data) {
		const freshArticles = data.articles;
		if (this.curPage === this.endPage || freshArticles.length < 5)
		  this.loadMore = false;
		this.setState((state) => ({articles: state.articles.concat(data.articles)}));
	}
	
	add_news(main_url){		
		if (this.loadMore === true){
			let newsAPIUrl = 'https://newsapi.org/v2/' + main_url + "apiKey=" +this.apiKey;
			let request = new Request(newsAPIUrl); 
			fetch(request)
			  .then((response) => { 
				  return response.json(); 
				})
			  .then((data) => { 
				  this.curPage++;
				  this.processArticles(data);
				  this.lastRequest = '';
			  });
		}
		else
			return;				
	}

	get_source(e){
		this.setState((state) => ({articles: []}));
		this.curPage = 0;
		this.lastevent = e.target.id;
		this.searchQuery = '';
        this.add_news(`everything?sources=${e.target.id}&pageSize=5&page=1&`);//
    }
	render() {	
		let news;
		if (this.state.articles.length) {
		  const newItems = this.state.articles.map(a => NewsItem(a)); 
		  news = <div id="news" className="news_class">{newItems}</div>
		} else if (this.lastevent !== ""){
		  news = (
			  <div id="news" className="news_class">
				<p>There are no news any more!</p>
			  </div>
		  );
		}
		const sources = this.state.sources.map((source, i) => {
                    return (
						<div>
                        <button className="source_btn" 
                        key={i} id={source.id} onClick={(e) => this.get_source(e)}>{source.name}</button><br/><br/></div>
                    );
                });
		return (
			<div>
			<header className="menu">
				<div>
					<div id="time" className="date"><h1>Today is: {this.get_cur_time()} </h1></div>
					<div>
					<input type="text" className="field_search_class" name="search" id="search_field_id" placeholder="Search..."
							 onKeyUp={(e) => this.handleSearchKeyUP(e)}/>
					<button className="btn_search_class" name="btn_search" id="btn_search_id"
							  onClick={(e) => this.handleSearchClick(e)}>Search
					</button>
					 </div>
				</div>
			</header>
			<div>
			<main>
				{news}
				<button name="btn_load_more" id="load_btn" className="btn_load_more"
						onClick={(e) => this.handleLoadMoreClick(e)}>Load more...
				</button>
			</main>

			<aside>
				<div id="view_source_list" className="view_source_list_class" >{sources}</div>
			</aside>
			</div>
			<footer className="app__footer">
				<p className="app__footer-text">Powered by <a className="app__footer-link" href="https://newsapi.org/">NewsApi</a></p>
			</footer>
			</div>);
	}
}

function App() {
  return <News/>
}

export default App;
