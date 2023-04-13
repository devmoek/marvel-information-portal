import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

import ErrorMessage from '../errorMessage/ErrorMessage';
import Spinner from '../spinner/Spinner';
import useMarvelService from '../../services/MarvelService';


import './comicsList.scss';


const ComicsList = (props) => {
    
    const [comicsList, setComicsList] = useState([]);
    const [newItemsLoading, setNewItemsLoading] = useState(false);
    const [offset, setOffset] = useState(700);
    const [comicsEnded, setComicsEnded] = useState(false);

    const {loading, error, getAllComics} = useMarvelService();

    useEffect(() => {
        onRequest(offset, true);
    }, [])

    const onRequest = (offset, initial) => {
        initial ? setNewItemsLoading(false) : setNewItemsLoading(true);
        getAllComics(offset)
            .then(onComicsListLoaded)
    }

    const onComicsListLoaded = (newComicsList) => {
        let ended = false;
        if(newComicsList.length < 9) {
            ended = true;
        }

        setComicsList(comicsList => [...comicsList, ...newComicsList]);
        setNewItemsLoading(false);
        setOffset(offset => offset + 9);
        setComicsEnded(ended);
    }

    function renderItems(arr) {
        const items =  arr.map((item, i) => {
            return (
                <CSSTransition key={item.id} timeout={500} classNames="comics__item">
                    <li 
                        className="comics__item"
                        tabIndex={0}
                        key={i}
                        >
                        <Link to={`/comics/${item.id}`}>
                            <img className="comics__item-img" src={item.thumbnail} alt={item.title}/>
                            <div className="comics__item-name">{item.title}</div>
                            <div className="comics__item-price">{item.price}</div>
                        </Link>
                    </li>
                </CSSTransition>
          
            )
        });

        return (
            <ul className="comics__grid">
                <TransitionGroup component={null}>
                    {items}
                </TransitionGroup>
            </ul>
        )
    }
    
    const items = renderItems(comicsList);

    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = loading && !newItemsLoading ? <Spinner/> : null;


    return (
        <div className="comics__list">
            {errorMessage}
            {spinner}
            {items}
            
            <button 
                className="button button__main button__long"
                disabled={newItemsLoading}
                style={{'display': comicsEnded ? 'none' : 'block'}}
                onClick={() => onRequest(offset)}>

                <div className="inner">load more</div>
            </button>
        </div>
    )
}

export default ComicsList;