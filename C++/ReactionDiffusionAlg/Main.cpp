#include <iostream>
#include "Diffusion.h"

using namespace ReactionDiffusionAlg;

int main()
{
    Diffusion diff = Diffusion();
    diff.update();
    diff.save();

    return 0;
}
