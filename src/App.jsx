import * as React from 'react';
import axios from 'axios';
import "./App.css"

const API_EDNPOINT = 'https://hn.algolia.com/api/v1/search?query='

//自定义useStorageState钩子
const useStorageState = (key, initialState) => {
  const [value, setValue] = React.useState(
    localStorage.getItem(key) || initialState
  );

  React.useEffect(() => {
    localStorage.setItem(key, value);
  }, [value, key])

  return [value, setValue]
}

const App = () => {

  const [searchTerm, setSearchTerm] = useStorageState(
    'search',
    'React'
  )

  // const stories = [
  //   {
  //     title: 'React',
  //     url: 'https://reactjs.org/',
  //     author: 'Jordan Walke',
  //     num_comments: 3,
  //     points: 4,
  //     objectID: 0,
  //   },
  //   {
  //     title: 'Redux',
  //     url: 'https://redux.js.org/',
  //     author: 'Dan Abramov, Andrew Clark',
  //     num_comments: 2,
  //     points: 5,
  //     objectID: 1,
  //   },
  // ];

  // let hasStored;
  // if (localStorage.getItem('search')) {
  //   hasStored = true;
  // } else {
  //   hasStored = false;
  // }

  // const initialState = hasStored ? localStorage.getItem('search') : ''

  // const [searchTerm, setSearchTerm] = React.useState(initialState);

  // const initialStories = [
  //   {
  //     title: 'React',
  //     url: 'https://reactjs.org/',
  //     author: 'Jordan Walke',
  //     num_comments: 3,
  //     points: 4,
  //     objectID: 0,
  //   },
  //   {
  //     title: 'Redux',
  //     url: 'https://redux.js.org/',
  //     author: 'Dan Abramov, Andrew Clark',
  //     num_comments: 2,
  //     points: 5,
  //     objectID: 1,
  //   },
  // ];

  // const getAsyncStories = () => Promise.resolve({ data: { stories: initialStories } })


  // 自定义异步延迟
  // const getAsyncStories = () => new Promise((resolve) =>
  //   setTimeout(
  //     () => resolve({ data: { stories: initialStories } }),
  //     2000
  //   )
  // )

  //抛出错误
  // const getAsyncStories = () => new Promise((resolve, reject) => setTimeout(reject, 2000))

  //if else例子
  // const storiesReducer = (state, action) => {
  //   if (action.type === 'SET_STORIES') {
  //     return action.payload
  //   } else if (action.type === 'REMOVE_STORY') {
  //     return state.filter(
  //       (story) => action.payload.objectID !== story.objectID
  //     )
  //   } else {
  //     throw new Error()
  //   }
  // }

  //最佳实例，使用switch管理状态
  // const storiesReducer = (state, action) => {
  //   switch (action.type) {
  //     case 'SET_STORIES':
  //       return action.payload;
  //     case 'REMOVE_STORY':
  //       return state.filter(
  //         (story) => action.payload.objectID !== story.objectID
  //       );
  //     default:
  //       throw new Error()
  //   }
  // }

  //状态管理
  const storiesReducer = (state, action) => {
    switch (action.type) {
      case 'STORIES_FETCH_INIT':
        return {
          ...state,
          isLoading: true,
          isError: false,
        };
      case 'STORIES_FETCH_SUCCESS':
        return {
          ...state,
          isLoading: false,
          isError: false,
          data: action.payload,
        };
      case 'STORIES_FETCH_FAILURE':
        return {
          ...state,
          isLoading: false,
          isError: true,
        };
      case 'REMOVE_STORY':
        return {
          ...state,
          data: state.data.filter(
            (story) => action.payload.objectID !== story.objectID
          ),
        };
      default:
        throw new Error()
    }
  }

  const [url, setUrl] = React.useState(
    `${API_EDNPOINT}${searchTerm}`
  )

  const handleSearchInput = (event) => {
    setSearchTerm(event.target.value);
  }

  const handleSearchSubmit = (event) => {
    setUrl(`${API_EDNPOINT}${searchTerm}`)

    event.preventDefault()
  }

  //整合useState状态
  const [stories, dispatchStories] = React.useReducer(
    storiesReducer,
    { data: [], isLoading: false, isError: false }
  )

  const handleFetchStories = React.useCallback(async () => {
    dispatchStories({ type: 'STORIES_FETCH_INIT' });

    try {
      const result = await axios.get(url);

      dispatchStories({
        type: 'STORIES_FETCH_SUCCESS',
        payload: result.data.hits,
      });
    } catch {
      dispatchStories({ type: 'STORIES_FETCH_FAILURE' })
    }
  }, [url])

  // const handleFetchStories = React.useCallback(() => {
  //   // if `searchTerm` is not present
  //   // e.g. null, empty string, undefined
  //   // do nothing
  //   // more generalized condition than searchTerm === ''
  //   if (!searchTerm) return;

  //   dispatchStories({ type: 'STORIES_FETCH_INIT' });

  //   // getAsyncStories()
  //   // fetch(url)
  //   axios
  //     .get(url)
  //     // .then((response) => response.json())
  //     .then((result) => {
  //       dispatchStories({
  //         type: 'STORIES_FETCH_SUCCESS',
  //         payload: result.data.hits,
  //       });
  //     })
  //     .catch(() => dispatchStories({ type: 'STORIES_FETCH_FAILURE' }))
  // }, [url]);

  React.useEffect(() => {
    handleFetchStories();
  }, [handleFetchStories])

  // React.useEffect(() => {
  //   // if `searchTerm` is not present
  //   // e.g. null, empty string, undefined
  //   // do nothing
  //   // more generalized condition than searchTerm === ''
  //   if (!searchTerm) return;

  //   dispatchStories({ type: 'STORIES_FETCH_INIT' });

  //   // getAsyncStories()
  //   fetch(`${API_EDNPOINT}${searchTerm}`)
  //     .then((response) => response.json())
  //     .then((result) => {
  //       dispatchStories({
  //         type: 'STORIES_FETCH_SUCCESS',
  //         payload: result.hits,
  //       });
  //     })
  //     .catch(() => dispatchStories({ type: 'STORIES_FETCH_FAILURE' }))
  // }, [searchTerm]);

  // const [stories, setStories] = React.useState(initialStories);
  // const [stories, setStories] = React.useState([]);

  //未整合的useState状态
  // const [stories, dispatchStories] = React.useReducer(
  //   storiesReducer,
  //   []
  // );
  // const [isLoading, setIsLoading] = React.useState(false);
  // const [isError, setIsError] = React.useState(false);

  // React.useEffect(() => {
  //   setIsLoading(true)
  //   getAsyncStories().then(result => {
  //     setStories(result.data.stories)
  //   })
  //     .catch(() => setError(true))
  // }, [])

  // React.useEffect(() => {

  //   setIsLoading(true)

  //   getAsyncStories()
  //     .then(result => {
  //       dispatchStories({
  //         type: 'SET_STORIES',
  //         payload: result.data.stories,
  //       });
  //       setIsLoading(false)
  //     })
  //     .catch(() => setIsError(true))
  // }, [])

  const handleRemoveStory = (item) => {

    dispatchStories({
      type: 'REMOVE_STORY',
      payload: item,
    })

    // const newStories = stories.filter(
    //   (story) => item.objectID !== story.objectID
    // )

    // dispatchStories({
    //   type: 'SET_STORIES',
    //   payload: newStories,
    // })

  }


  // React.useEffect(() => {
  //   localStorage.setItem('search', searchTerm)
  // }, [searchTerm])

  // const handleSearch = (e) => {
  //   setSearchTerm(e.target.value);
  // }

  // const searchedStories = stories.data.filter(function (story) {
  //   return story.title.toLowerCase().includes(searchTerm.toLowerCase())
  // })

  // const searchedStories = stories.filter(function (story) {
  //   return story.title.toLowerCase().includes(searchTerm.toLowerCase())
  // })


  return (

    <div>


      {/* <form onSubmit={handleSearchSubmit}>
        <InputWithLabel
          id="search"
          // label="Search"
          value={searchTerm}
          isFocused
          onInputChange={handleSearchInput}
        >
          <strong>Search: </strong>
        </InputWithLabel>

        <button
          type='submit'
          disabled={!searchTerm}
        >
          Submit
        </button>
      </form> */}


      {/* <InputWithLabel
        id="search"
        // label="Search"
        value={searchTerm}
        isFocused
        onInputChange={handleSearch}
      >
        <strong>Search: </strong>
      </InputWithLabel> */}

      {/* <Search search={searchTerm} onSearch={handleSearch} /> */}

      <h1>My Hacker Stories</h1>

      <SearchForm
        searchTerm={searchTerm}
        onSearchInput={handleSearchInput}
        onSearchSubmit={handleSearchSubmit}
      />

      <hr />

      {stories.isError && <p>Something went wrong ...</p>}

      {
        stories.isLoading ?
          (<p>Loading ...</p>)
          :
          (<List list={stories.data} onRemoveItem={handleRemoveStory} />)
      }

    </div>
  );
};

const InputWithLabel = ({ id, label, value, onInputChange, type = 'text', children, isFocused }) => {

  const inputRef = React.useRef();

  React.useEffect(() => {
    if (isFocused && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isFocused])

  return (
    <>
      <label htmlFor={id}>{children}</label>
      &nbsp;
      <input
        ref={inputRef}
        id={id}
        type={type}
        value={value}
        onChange={onInputChange}
      />
    </>
  )
}

const SearchForm = ({
  searchTerm,
  onSearchInput,
  onSearchSubmit
}) => (
  <form onSubmit={onSearchSubmit}>
    <InputWithLabel
      id="search"
      // label="Search"
      value={searchTerm}
      isFocused
      onInputChange={onSearchInput}
    >
      <strong>Search: </strong>
    </InputWithLabel>

    <button
      type='submit'
      disabled={!searchTerm}
    >
      Submit
    </button>
  </form>
)



//增加默认type,使其组件封装
// const InputWithLabel = ({ id, label, value, onInputChange, type = 'text', children, isFocused }) => (
//   <>
//     <label htmlFor={id}>{children}</label>
//     &nbsp;
//     <input
//       id={id}
//       type={type}
//       value={value}
//       autoFocus={isFocused}
//       onChange={onInputChange}
//     />
//   </>
// )

// const Search = ({ search, onSearch }) => (
//   <>
//     <label htmlFor="search">Search: </label>
//     <input
//       id='search'
//       type='tetx'
//       value={search}
//       onChange={onSearch}
//     />
//   </>
// )
//需要使用<div></div>包裹
// const Search = (searchTerm) => (
//   <div>
//     <label htmlFor="search">Search: </label>
//     <input
//       id="search"
//       type="text"
//       value={searchTerm.search}
//       onChange={searchTerm.onSearch} />
//   </div>
// );

//将其作为数组返回,需要使用key标记
// const Search = ({ search, onSearch }) => [
//   <label key="1" htmlFor='search'>
//     Search:{' '}
//   </label>,
//   <input
//     key="2"
//     id='search'
//     type="text"
//     value={search}
//     onChange={onSearch}
//   />
// ]

//使用Fragment包裹
// const Search = ({ search, onSearch }) => (
//   <React.Fragment>
//     <label htmlFor="search">Search: </label>
//     <input
//       id='search'
//       type='tetx'
//       value={search}
//       onChange={onSearch}
//     />
//   </React.Fragment>
// )

// const List = (searchedStories) => (
//   <ul>
//     {searchedStories.list.map((item) => (
//       <Item key={item.objectID} item={item} />
//     ))}
//   </ul>
// );

const List = ({ list, onRemoveItem }) => (
  <ul>
    {list.map((item) => (
      <Item
        key={item.objectID}
        item={item}
        onRemoveItem={onRemoveItem}
      />
    ))}
  </ul>
)


// const Item = (props) => (
//   <li>
//     <span>
//       <a href={props.item.url}>{props.item.title}</a>
//     </span>
//     <span>{props.item.author}</span>
//     <span>{props.item.num_comments}</span>
//     <span>{props.item.points}</span>
//   </li>
// );

// const Item = ({ item, onRemoveItem }) => {
//   const handleRemoveItem = () => {
//     onRemoveItem(item);
//   }

//   return (
//     <li>
//       <span>
//         <a href={item.url}>{item.title}</a>
//       </span>
//       <span>{item.author}</span>
//       <span>{item.num_comments}</span>
//       <span>{item.points}</span>
//       <span>
//         <button type='button' onClick={handleRemoveItem}>
//           Dismiss
//         </button>
//       </span>
//     </li>
//   )
// }

//优化,使用bind函数
// const Item = ({ item, onRemoveItem }) => (
//   <li>
//     <span>
//       <a href={item.url}>{item.title}</a>
//     </span>
//     <span>{item.author}</span>
//     <span>{item.num_comments}</span>
//     <span>{item.points}</span>
//     <span>
//       <button type='button' onClick={onRemoveItem.bind(null, item)}>
//         Dismiss
//       </button>
//     </span>
//   </li>
// )

//优化使用内联函数
const Item = ({ item, onRemoveItem }) => (
  <li>
    <span>
      <a href={item.url}>{item.title}</a>
    </span>
    <span>{item.author}</span>
    <span>{item.num_comments}</span>
    <span>{item.points}</span>
    <span>
      <button type='button' onClick={() => onRemoveItem(item)}>
        Dismiss
      </button>
    </span>
  </li>
)

export default App;

