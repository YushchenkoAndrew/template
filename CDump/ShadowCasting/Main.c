#include <SDL2/SDL.h>
#include <stdio.h>

#ifdef __EMSCRIPTEN__
// #include <emscripten.h>
#include <emscripten/emscripten.h>
#endif // __EMSCRIPTEN__

#define H 640
#define W 480
#define fps 60

SDL_Window *window;
SDL_Renderer *render;
SDL_Event *event;


void main_loop() {
  SDL_PollEvent(event);

  switch (event->type)
  {
    default:
      break;
  }

  SDL_SetRenderDrawColor(render, 255, 0, 255, 255);
  SDL_RenderClear(render);
}


int main() {
  SDL_Init(SDL_INIT_VIDEO);
  window = SDL_CreateWindow("ShadowCasting", SDL_WINDOWPOS_UNDEFINED, SDL_WINDOWPOS_UNDEFINED, W, H, SDL_WINDOW_SHOWN | SDL_WINDOW_OPENGL);
  if (window == NULL) {
    printf("NOOOO %s\n", SDL_GetError());
  }

  render = SDL_CreateRenderer(window, -1, SDL_RENDERER_ACCELERATED);

  printf("Hello world\n");


  #ifdef __EMSCRIPTEN__
  // emscripten_set_main_loop(main_loop, 0, 1);
  #else
  while (1) {
    draw();
    SDL_Delay(1000 / fps);
  }
  #endif // __EMSCRIPTEN__

  #ifdef __EMSCRIPTEN__
  // emscripten_cancel_main_loop();
  #endif

  SDL_DestroyRenderer(render);
  SDL_DestroyWindow(window);
  SDL_Quit();
  return 0;
}
