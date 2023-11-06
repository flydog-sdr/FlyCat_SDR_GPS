#pragma once

#include <stdint.h>

#define EE_NPINS 74
#define	EE_PINS_OFFSET_BASE		88
typedef struct {
	volatile uint32_t config[4];
	volatile uint32_t data;
	volatile uint32_t driver[2];
	volatile uint32_t pull[2];
} gpio_config;

typedef struct {
	u1_t pin, eeprom_off;
	gpio_config cfg;
} __attribute__((packed)) gpio_t;

typedef struct {
	gpio_t gpio;
	
	#define PIN_USED		0x8000
	#define PIN_DIR_IN		0x2000
	#define PIN_DIR_OUT		0x4000
	#define PIN_DIR_BIDIR	0x6000
	#define PIN_PMUX_BITS	0x007f
	u2_t attrs;
} __attribute__((packed)) pin_t;

extern pin_t eeprom_pins[EE_NPINS];

#define ALLWINER_H3_PERI_BASE        0x01C20000
#define ALLWINER_H3_PERI_PA_OFFSET   0x0800
#define GPIO_BASE ALLWINER_H3_PERI_BASE /* GPIO controller */

#define PMUX_OUT_PU 2 

#define PMUX_IO_PDIS 0
#define PMUX_IO_PU 2 
#define PMUX_IO_PD 1

#define GPIO_HIZ -1

enum gpio_dir_e {
GPIO_DIR_IN = 0,
GPIO_DIR_OUT = 1,
GPIO_DIR_BIDIR = 2
};

u1_t GPIO_READ_BIT(gpio_t io);
void GPIO_INPUT(gpio_t io);
void GPIO_PULL(gpio_t io, int v);
void GPIO_OUTPUT(gpio_t io);
void GPIO_SET_BIT(gpio_t io);
void GPIO_CLR_BIT(gpio_t io);
void GPIO_WRITE_BIT(gpio_t io, int v);

extern volatile unsigned *gpio;

//extern gpio_t GPIO_NONE;
extern gpio_t FPGA_INIT, FPGA_PGM;
//extern gpio_t SPIn_SCLK, SPIn_MISO, SPIn_MOSI, 
extern gpio_t SPIn_CS0, SPIn_CS1;
extern gpio_t CMD_READY, SND_INTR;

#define devio_check(gpio, dir, pmux_val) \
	_devio_check(#gpio, gpio, dir, pmux_val);
void _devio_check(const char *name, gpio_t gpio, gpio_dir_e dir, u4_t pmux_val);

#define gpio_setup(gpio, dir, initial, pmux_val1, pmux_val2) \
	_gpio_setup(#gpio, gpio, dir, initial, pmux_val1, pmux_val2);
void _gpio_setup(const char *name, gpio_t gpio, gpio_dir_e dir, u4_t initial, u4_t pmux_val1, u4_t pmux_val2);

void peri_init();
void gpio_test(int gpio_test);
void peri_free();

#define FPGA_INIT_PIN 8
#define FPGA_PGM_PIN 7

#define SPIn_CS0_PIN 8
#define SPIn_CS1_PIN 21
#define CMD_READY_PIN 9
#define SND_INTR_PIN 20

const int port_a_map[22][2] = {
    {0, 0}, // PA0
    {0, 4}, // PA1
    {0, 8}, // PA2
    {0, 12}, // PA3
    {0, 16}, // PA4
    {0, 20}, // PA5
    {0, 24}, // PA6
    {0, 28}, // PA7

    {1, 0}, // PA8
    {1, 4}, // PA9
    {1, 8}, // PA10
    {1, 12}, // PA11
    {1, 16}, // PA12
    {1, 20}, // PA13
    {1, 24}, // PA14
    {1, 28}, // PA15

    {2, 0}, // PA16
    {2, 4}, // PA17
    {2, 8}, // PA18
    {2, 12}, // PA19
    {2, 16}, // PA20
    {2, 20}, // PA21
};
