import React, { Component } from 'react';
import { hot } from 'react-hot-loader';
import ReactPlayer from 'react-player';

import './index.css';

import {
  formatToText,
  getCurrentSubtitleFromArray,
  getTextFromInputFile,
} from './CustomFunctions';

class App extends Component {
  state = {
    url: null,
    pip: false,
    playing: true,
    controls: true,
    light: false,
    volume: 0.8,
    muted: false,
    played: 0,
    duration: 0,
    playbackRate: 1.0,
    loop: false,
    indexCurrentSubtitle: null,
    textFromFile: {},
  }

  onProgress = (state) => {
    console.log('onProgress', state);
    const {
      duration, played, textFromFile, seeking,
    } = this.state;
    const seg = formatToText(duration * played);
    const currentSubtitle = getCurrentSubtitleFromArray(seg, textFromFile);
    if (currentSubtitle) {
      this.setState({
        indexCurrentSubtitle: parseInt(seg, 10),
      });
    }
    if (!seeking) {
      this.setState(state);
    }
  }

  onEnded = () => {
    console.log('onEnded');
    const { loop } = this.state;
    this.setState({ playing: loop });
  }

  onDuration = (duration) => {
    console.log('onDuration', duration);
    this.setState({ duration });
  }

  onLessTime = (second) => {
    console.log('Less ', second, ' seconds');
    const { played, duration } = this.state;
    const seg = (played * duration) - second;
    this.player.seekTo(seg, 'seconds');
  }

  onMoreTime = (second) => {
    console.log('More ', second, ' seconds');
    const { played, duration } = this.state;
    const seg = (played * duration) + second;
    this.player.seekTo(seg, 'seconds');
  }

  renderLoadButton = (url, label) => (
    <button type="button" onClick={() => this.load(url)}>
      {label}
    </button>
  )

  ref = (player) => {
    this.player = player;
  }

  onLoadCustomURL = (url) => {
    this.setState({ url });
  }

  onClickFile = () => {
    document.getElementById('file').click();
  }

  onChangeFile = (e) => {
    const file = e[0];
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = () => {
      getTextFromInputFile(reader.result)
        .then(text => this.setState({ textFromFile: text }));
    };
  }

  render() {
    const {
      url, playing, controls,
      light, volume, muted,
      loop, playbackRate, pip,
      textFromFile,
      indexCurrentSubtitle,
    } = this.state;

    return (
      <div className="app">
        <section className="player">
          <div className="player-wrapper">
            {url === null
              ? (
                <img
                  alt="video"
                  src="https://cdn3.iconfinder.com/data/icons/complete-set-icons/512/video512x512.png"
                />
              )
              : (
                <ReactPlayer
                  ref={this.ref}
                  width="100%"
                  height="100%"
                  url={url}
                  pip={pip}
                  playing={playing}
                  controls={controls}
                  light={light}
                  loop={loop}
                  playbackRate={playbackRate}
                  volume={volume}
                  muted={muted}
                  onReady={() => console.log('onReady')}
                  onStart={() => console.log('onStart')}
                  onBuffer={() => console.log('onBuffer')}
                  onEnded={this.onEnded}
                  onError={e => console.log('onError', e)}
                  onProgress={this.onProgress}
                  onDuration={this.onDuration}
                />
              )
              }
          </div>
        </section>
        <section className="subtitles">
          {Object.keys(textFromFile).length > 1
            ? Object.keys(textFromFile).map(key => (
              <span
                key={key}
                id={key}
                className={parseInt(key, 10) === indexCurrentSubtitle ? 'selected' : ''}
              >
                {textFromFile[key]}
                {' '}
              </span>
            ))
            : 'Not subtitles loaded. Look "Info."'}
        </section>
        <section className="custom-video">
          <section className="form-url">
            <span className="form-info">
            Info.
              <span className="intructions">
              Introduzca la url del video. Luego seleccione los subtitulos
              que desea sincronizar.
              </span>
            </span>
            <input ref={(input) => { this.urlInput = input; }} type="text" placeholder="Enter URL" />
            <button type="button" onClick={() => this.onLoadCustomURL(this.urlInput.value)}>
              Load
            </button>
          </section>
          <section className="control">
            <button type="button" onClick={() => this.onLessTime(10)}>10s Less</button>
            <button type="button" onClick={() => this.onLessTime(5)}>5s Less</button>
            <button type="button" onClick={() => this.onMoreTime(5)}>5s More</button>
            <button type="button" onClick={() => this.onMoreTime(10)}>10s More</button>
          </section>
        </section>
        <footer className="footer">
          <button type="button" onClick={this.onClickFile}>Load Subtitle</button>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://github.com/moudev/subtitles-like-udemy"
          >
            <img
              src="https://www.freepngimg.com/thumb/github/1-2-github-free-png-image.png"
              alt="github"
            />
            GitHub Repository
          </a>
          <input
            hidden
            type="file"
            accept="text/plain"
            id="file"
            onChange={e => this.onChangeFile(e.target.files)}
          />
        </footer>
      </div>
    );
  }
}

export default hot(module)(App);
