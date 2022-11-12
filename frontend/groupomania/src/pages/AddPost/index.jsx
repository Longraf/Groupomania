import React from 'react';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import SimpleMDE from 'react-simplemde-editor';

import 'easymde/dist/easymde.min.css';
import styles from './AddPost.module.scss';
import { useSelector } from 'react-redux';
import { selectIsAuth } from '../../redux/slices/auth';
import { useNavigate, Navigate, useParams } from 'react-router-dom';
import { axios } from '../../axios';


export const AddPost = () => {
  const {id} = useParams()
  const navigate = useNavigate();
  const isAuth = useSelector(selectIsAuth);
  const [isLoading, setLoading] = React.useState(false);
  const [text, setText] = React.useState('');
  const [title, setTitle] = React.useState('');
  const [tags, setTags] = React.useState('');
  const [imageUrl, setImageUrl] = React.useState('');
  const inputFileRef = React.useRef(null);

const isEditing = Boolean(id)

  const handleChangeFile = async (event) => {
    try {
      const formData = new FormData();
      formData.append('image', event.target.files[0]);
      const { data } = await axios.post('/images', formData);
      setImageUrl(data.url)
    } catch (err) { 
      console.warn(err);
      alert('Echec de téléchargement')
    }
  };

  const onClickRemoveImage = () => { 
    setImageUrl('');
  };

  const onChange = React.useCallback((value) => {
    setText(value);
  }, []);

const onSubmit = async () => {
  try {
    setLoading(true);
    const fields = {
      title,
      imageUrl,
      text,
      tags,

    }
    const {data} = isEditing 
    ? await axios.put(`/posts/${id}`, fields) 
    : await axios.post('/posts', fields);

const _id = isEditing ? id : data._id ;
navigate(`/posts/${_id}`)

  } catch (err) {
    console.warn(err);
    alert('Echec de création d un post')
  }
}

React.useEffect(() => {
  if (id) {
    axios.get(`/posts/${id}`).then(({data}) => {
      setTitle(data.title);
      setText(data.text);
      setImageUrl(data.imageUrl);
      setTags(data.tags.join(','));
    });
  }
}, []);

  const options = React.useMemo(
    () => ({
      spellChecker: false,
      maxHeight: '400px',
      autofocus: true,
      placeholder: 'Entrez du texte...',
      status: false,
      // autosave: {
      //   enabled: true,
      //   delay: 1000,
      // },
    }),
    [],
  );

  if (!window.localStorage.getItem('token') && !isAuth) {
    return <Navigate to="/" />
  }



  return (
    <Paper elevation={0} style={{ padding: 30 }}>
      <Button onClick={() => inputFileRef.current.click()} variant="outlined" size="large">
        Télécharger l'aperçu
      </Button>
      <input ref={inputFileRef} type="file" onChange={handleChangeFile} hidden />
      {imageUrl && (
        <>
        <Button variant="contained" color="error" onClick={onClickRemoveImage}>
          Delete
        </Button>
        <img className={styles.image} src={`http://localhost:4000${imageUrl}`} alt="Uploaded" />
        </>
      )}
      <br />
      <br />
      <TextField
        classes={{ root: styles.title }}
        variant="standard"
        placeholder="Le titre de l'article..."
        value={title}
        onChange={e => setTitle(e.target.value)}
        fullWidth
      />
      <TextField
        classes={{ root: styles.tags }}
        variant="standard"
        placeholder="Tags"
        value={tags}
        onChange={e => setTags(e.target.value)}
        fullWidth />
      <SimpleMDE className={styles.editor} value={text} onChange={onChange} options={options} />
      <div className={styles.buttons}>
        <Button onClick={onSubmit} size="large" variant="contained">
          {isEditing ? 'Sauvgarder' : 'Publier'}
        </Button>
        <a href="/">
          <Button size="large">Annuler</Button>
        </a>
      </div>
    </Paper>
  );
};
