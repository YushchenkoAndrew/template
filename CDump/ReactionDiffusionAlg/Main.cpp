#include <iostream>
#include "Diffusion.h"

using namespace ReactionDiffusionAlg;

int main()
{
    Diffusion diff = Diffusion(0.0367, 0.0649);

    while (diff.epoch < 100000)
    {
        diff.update();
        if (diff.epoch % 50 == 0)
        {
            std::cout << "Yep \nEpoch = " << diff.epoch << "\n";
            diff.save();
        }
    }

    std::cout << "Done! \n";

    return 0;
}
