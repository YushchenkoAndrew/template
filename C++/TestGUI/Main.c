#include <SDL2/SDL.h>
#include <SDL2/SDL_image.h>
#include <SDL2/SDL_timer.h>
#include <stdio.h>


int main() {
  if (SDL_Init(SDL_INIT_EVERYTHING) != NULL) {
    printf("ERROR %s", SDL_GetError());
  }

  SDL_Window *win = SDL_CreateWindow("GAME", SDL_WINDOWPOS_CENTERED, SDL_WINDOWPOS_CENTERED, 1000, 1000, 0);

  while(1);

  return 0;
}