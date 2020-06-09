import torch.nn as nn
import torch.nn.functional as func


class Net(nn.Module):
    def __init__(self):
        print("Hi")
        super().__init__()

        # Create neuron tree
        # fc - fully connected layer
        #                     input, output
        self.fc1 = nn.Linear(28 * 28,  64)
        self.fc2 = nn.Linear(64,    64)
        self.fc3 = nn.Linear(64,    64)
        self.fc4 = nn.Linear(64,  10)

    def forward(self, x):
        x = func.relu(self.fc1(x))
        x = func.relu(self.fc2(x))
        x = func.relu(self.fc3(x))
        x = self.fc4(x)

        return x
